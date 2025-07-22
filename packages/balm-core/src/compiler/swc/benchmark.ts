/**
 * SWC performance benchmarking and comparison tools
 * Provides comprehensive performance testing against Babel and other compilers
 */

import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { SWCCompiler } from './index.js';
import { BabelCompiler } from '../babel/index.js';
import { CompilerOptions } from '../base.js';

/**
 * Performance benchmark result interface
 */
export interface BenchmarkResult {
  compiler: string;
  version: string;
  metrics: {
    transformTime: number;
    minifyTime: number;
    totalTime: number;
    memoryUsage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
    };
    outputSize: {
      original: number;
      transformed: number;
      minified: number;
      compression: number;
    };
  };
  files: {
    processed: number;
    failed: number;
    totalSize: number;
  };
}

/**
 * Benchmark comparison result
 */
export interface BenchmarkComparison {
  swc: BenchmarkResult;
  babel: BenchmarkResult;
  improvement: {
    transformTime: number;
    minifyTime: number;
    totalTime: number;
    memoryUsage: number;
    outputSize: number;
  };
  summary: {
    winner: 'swc' | 'babel' | 'tie';
    speedup: string;
    recommendation: string;
  };
}

/**
 * Test file configuration
 */
export interface TestFileConfig {
  name: string;
  path: string;
  type: 'javascript' | 'typescript' | 'jsx' | 'tsx';
  size: number;
  complexity: 'simple' | 'medium' | 'complex';
}

/**
 * SWC performance benchmark suite
 */
export class SWCBenchmark {
  private testFiles: TestFileConfig[] = [];
  private compilerOptions: CompilerOptions;

  constructor(options: CompilerOptions = {}) {
    this.compilerOptions = {
      target: 'es2020',
      module: 'es6',
      jsx: 'react-jsx',
      sourceMap: false, // Disable for fair comparison
      minify: false,
      ...options,
    };
  }

  /**
   * Add test files for benchmarking
   */
  addTestFiles(files: string[] | TestFileConfig[]): void {
    for (const file of files) {
      if (typeof file === 'string') {
        this.addTestFile(file);
      } else {
        this.testFiles.push(file);
      }
    }
  }

  /**
   * Add a single test file
   */
  addTestFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test file not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath);
    
    const config: TestFileConfig = {
      name: path.basename(filePath),
      path: filePath,
      type: this.getFileType(ext),
      size: stats.size,
      complexity: this.estimateComplexity(filePath, stats.size),
    };

    this.testFiles.push(config);
  }

  /**
   * Run comprehensive benchmark comparing SWC vs Babel
   */
  async runComparison(): Promise<BenchmarkComparison> {
    if (this.testFiles.length === 0) {
      throw new Error('No test files added. Use addTestFiles() first.');
    }

    console.log(`🚀 Starting SWC vs Babel benchmark with ${this.testFiles.length} files...`);

    // Run SWC benchmark
    console.log('📊 Benchmarking SWC...');
    const swcResult = await this.benchmarkCompiler('swc');

    // Run Babel benchmark
    console.log('📊 Benchmarking Babel...');
    const babelResult = await this.benchmarkCompiler('babel');

    // Calculate improvements
    const improvement = this.calculateImprovement(swcResult, babelResult);

    // Generate summary
    const summary = this.generateSummary(swcResult, babelResult, improvement);

    return {
      swc: swcResult,
      babel: babelResult,
      improvement,
      summary,
    };
  }

  /**
   * Run benchmark for a specific compiler
   */
  async benchmarkCompiler(compilerType: 'swc' | 'babel'): Promise<BenchmarkResult> {
    const compiler = compilerType === 'swc' 
      ? new SWCCompiler(this.compilerOptions)
      : new BabelCompiler(this.compilerOptions);

    const startMemory = process.memoryUsage();
    const startTime = performance.now();

    let transformTime = 0;
    let minifyTime = 0;
    let totalOriginalSize = 0;
    let totalTransformedSize = 0;
    let totalMinifiedSize = 0;
    let processedFiles = 0;
    let failedFiles = 0;

    // Process each test file
    for (const testFile of this.testFiles) {
      try {
        const originalCode = fs.readFileSync(testFile.path, 'utf-8');
        totalOriginalSize += originalCode.length;

        // Measure transform time
        const transformStart = performance.now();
        const transformResult = await compiler.transform(originalCode, testFile.path);
        const transformEnd = performance.now();
        
        transformTime += (transformEnd - transformStart);
        totalTransformedSize += transformResult.code.length;

        // Measure minify time if enabled
        if (this.compilerOptions.minify) {
          const minifyStart = performance.now();
          const minifyResult = await compiler.minify(transformResult.code, testFile.path);
          const minifyEnd = performance.now();
          
          minifyTime += (minifyEnd - minifyStart);
          totalMinifiedSize += minifyResult.code.length;
        } else {
          totalMinifiedSize = totalTransformedSize;
        }

        processedFiles++;
      } catch (error) {
        console.warn(`❌ Failed to process ${testFile.name}: ${(error as Error).message}`);
        failedFiles++;
      }
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const totalTime = endTime - startTime;
    const compressionRatio = totalOriginalSize > 0 
      ? ((totalOriginalSize - totalMinifiedSize) / totalOriginalSize) * 100 
      : 0;

    return {
      compiler: compilerType,
      version: compiler.getConfig().version,
      metrics: {
        transformTime,
        minifyTime,
        totalTime,
        memoryUsage: {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
          external: endMemory.external - startMemory.external,
        },
        outputSize: {
          original: totalOriginalSize,
          transformed: totalTransformedSize,
          minified: totalMinifiedSize,
          compression: compressionRatio,
        },
      },
      files: {
        processed: processedFiles,
        failed: failedFiles,
        totalSize: totalOriginalSize,
      },
    };
  }

  /**
   * Generate performance report
   */
  generateReport(comparison: BenchmarkComparison): string {
    const lines: string[] = [];
    
    lines.push('# SWC vs Babel Performance Benchmark Report');
    lines.push('');
    lines.push(`**Test Date:** ${new Date().toISOString()}`);
    lines.push(`**Test Files:** ${this.testFiles.length}`);
    lines.push(`**Total Size:** ${this.formatBytes(comparison.swc.files.totalSize)}`);
    lines.push('');

    // Summary
    lines.push('## Summary');
    lines.push(`**Winner:** ${comparison.summary.winner.toUpperCase()}`);
    lines.push(`**Speed Improvement:** ${comparison.summary.speedup}`);
    lines.push(`**Recommendation:** ${comparison.summary.recommendation}`);
    lines.push('');

    // Detailed Results
    lines.push('## Detailed Results');
    lines.push('');
    lines.push('### SWC Results');
    lines.push(this.formatBenchmarkResult(comparison.swc));
    lines.push('');
    lines.push('### Babel Results');
    lines.push(this.formatBenchmarkResult(comparison.babel));
    lines.push('');

    // Improvements
    lines.push('### Performance Improvements');
    lines.push(`- **Transform Time:** ${comparison.improvement.transformTime.toFixed(1)}% faster`);
    lines.push(`- **Minify Time:** ${comparison.improvement.minifyTime.toFixed(1)}% faster`);
    lines.push(`- **Total Time:** ${comparison.improvement.totalTime.toFixed(1)}% faster`);
    lines.push(`- **Memory Usage:** ${comparison.improvement.memoryUsage.toFixed(1)}% less`);
    lines.push(`- **Output Size:** ${comparison.improvement.outputSize.toFixed(1)}% smaller`);
    lines.push('');

    // Test Files
    lines.push('### Test Files');
    lines.push('| File | Type | Size | Complexity |');
    lines.push('|------|------|------|------------|');
    for (const file of this.testFiles) {
      lines.push(`| ${file.name} | ${file.type} | ${this.formatBytes(file.size)} | ${file.complexity} |`);
    }

    return lines.join('\n');
  }

  /**
   * Create standard test suite with common file types
   */
  static async createStandardTestSuite(options: CompilerOptions = {}): Promise<SWCBenchmark> {
    const benchmark = new SWCBenchmark(options);
    
    // Generate test files if they don't exist
    await this.generateTestFiles();
    
    // Add standard test files
    const testDir = path.join(process.cwd(), 'test-files');
    const testFiles = [
      'simple.js',
      'complex.js',
      'react-component.jsx',
      'typescript.ts',
      'react-typescript.tsx',
      'large-bundle.js',
    ];

    for (const file of testFiles) {
      const filePath = path.join(testDir, file);
      if (fs.existsSync(filePath)) {
        benchmark.addTestFile(filePath);
      }
    }

    return benchmark;
  }

  /**
   * Generate test files for benchmarking
   */
  private static async generateTestFiles(): Promise<void> {
    const testDir = path.join(process.cwd(), 'test-files');
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const testFiles = {
      'simple.js': this.generateSimpleJS(),
      'complex.js': this.generateComplexJS(),
      'react-component.jsx': this.generateReactComponent(),
      'typescript.ts': this.generateTypeScript(),
      'react-typescript.tsx': this.generateReactTypeScript(),
      'large-bundle.js': this.generateLargeBundle(),
    };

    for (const [filename, content] of Object.entries(testFiles)) {
      const filePath = path.join(testDir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    }
  }

  // Private helper methods

  private getFileType(extension: string): TestFileConfig['type'] {
    switch (extension.toLowerCase()) {
      case '.js':
      case '.mjs':
      case '.cjs':
        return 'javascript';
      case '.jsx':
        return 'jsx';
      case '.ts':
        return 'typescript';
      case '.tsx':
        return 'tsx';
      default:
        return 'javascript';
    }
  }

  private estimateComplexity(filePath: string, size: number): TestFileConfig['complexity'] {
    if (size < 1024) return 'simple';
    if (size < 10240) return 'medium';
    return 'complex';
  }

  private calculateImprovement(swc: BenchmarkResult, babel: BenchmarkResult) {
    return {
      transformTime: ((babel.metrics.transformTime - swc.metrics.transformTime) / babel.metrics.transformTime) * 100,
      minifyTime: ((babel.metrics.minifyTime - swc.metrics.minifyTime) / babel.metrics.minifyTime) * 100,
      totalTime: ((babel.metrics.totalTime - swc.metrics.totalTime) / babel.metrics.totalTime) * 100,
      memoryUsage: ((babel.metrics.memoryUsage.heapUsed - swc.metrics.memoryUsage.heapUsed) / babel.metrics.memoryUsage.heapUsed) * 100,
      outputSize: ((babel.metrics.outputSize.minified - swc.metrics.outputSize.minified) / babel.metrics.outputSize.minified) * 100,
    };
  }

  private generateSummary(swc: BenchmarkResult, babel: BenchmarkResult, improvement: any) {
    const speedup = improvement.totalTime > 0 
      ? `${improvement.totalTime.toFixed(1)}% faster`
      : `${Math.abs(improvement.totalTime).toFixed(1)}% slower`;

    let winner: 'swc' | 'babel' | 'tie' = 'tie';
    let recommendation = 'Both compilers perform similarly.';

    if (improvement.totalTime > 10) {
      winner = 'swc';
      recommendation = 'SWC provides significant performance benefits. Recommended for large projects.';
    } else if (improvement.totalTime < -10) {
      winner = 'babel';
      recommendation = 'Babel performs better in this test case. Consider project-specific factors.';
    }

    return {
      winner,
      speedup,
      recommendation,
    };
  }

  private formatBenchmarkResult(result: BenchmarkResult): string {
    const lines = [
      `**Compiler:** ${result.compiler} v${result.version}`,
      `**Transform Time:** ${result.metrics.transformTime.toFixed(2)}ms`,
      `**Minify Time:** ${result.metrics.minifyTime.toFixed(2)}ms`,
      `**Total Time:** ${result.metrics.totalTime.toFixed(2)}ms`,
      `**Memory Usage:** ${this.formatBytes(result.metrics.memoryUsage.heapUsed)}`,
      `**Output Size:** ${this.formatBytes(result.metrics.outputSize.minified)}`,
      `**Compression:** ${result.metrics.outputSize.compression.toFixed(1)}%`,
      `**Files Processed:** ${result.files.processed}/${result.files.processed + result.files.failed}`,
    ];
    return lines.join('\n');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Test file generators
  private static generateSimpleJS(): string {
    return `
// Simple JavaScript file for benchmarking
const greeting = 'Hello, World!';
const numbers = [1, 2, 3, 4, 5];

function add(a, b) {
  return a + b;
}

const sum = numbers.reduce(add, 0);
console.log(greeting, sum);

export { greeting, add, sum };
    `.trim();
  }

  private static generateComplexJS(): string {
    return `
// Complex JavaScript file with modern features
import { debounce, throttle } from 'lodash';

class DataProcessor {
  #privateField = new Map();
  
  constructor(options = {}) {
    this.options = { ...this.getDefaults(), ...options };
    this.cache = new WeakMap();
    this.observers = new Set();
  }
  
  getDefaults() {
    return {
      batchSize: 100,
      timeout: 5000,
      retries: 3,
    };
  }
  
  async processData(data) {
    const batches = this.createBatches(data);
    const results = [];
    
    for await (const batch of batches) {
      try {
        const result = await this.processBatch(batch);
        results.push(result);
      } catch (error) {
        console.error('Batch processing failed:', error);
        throw error;
      }
    }
    
    return this.mergeResults(results);
  }
  
  *createBatches(data) {
    for (let i = 0; i < data.length; i += this.options.batchSize) {
      yield data.slice(i, i + this.options.batchSize);
    }
  }
  
  async processBatch(batch) {
    return Promise.all(batch.map(item => this.processItem(item)));
  }
  
  processItem = debounce(async (item) => {
    const cached = this.cache.get(item);
    if (cached) return cached;
    
    const result = await this.transform(item);
    this.cache.set(item, result);
    this.notifyObservers(result);
    
    return result;
  }, 100);
  
  transform(item) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...item,
          processed: true,
          timestamp: Date.now(),
        });
      }, Math.random() * 100);
    });
  }
  
  notifyObservers(result) {
    this.observers.forEach(observer => observer(result));
  }
  
  addObserver(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }
}

export default DataProcessor;
    `.trim();
  }

  private static generateReactComponent(): string {
    return `
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId, onUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUser = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(\`/api/users/\${id}\`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);
  
  const handleUpdate = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    onUpdate?.(updates);
  }, [onUpdate]);
  
  const displayName = useMemo(() => {
    if (!user) return '';
    return \`\${user.firstName} \${user.lastName}\`;
  }, [user]);
  
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="empty">No user found</div>;
  
  return (
    <div className="user-profile">
      <div className="user-header">
        <img 
          src={user.avatar} 
          alt={displayName}
          className="user-avatar"
        />
        <h1>{displayName}</h1>
        <p className="user-email">{user.email}</p>
      </div>
      
      <div className="user-details">
        <div className="detail-item">
          <label>Phone:</label>
          <span>{user.phone || 'Not provided'}</span>
        </div>
        <div className="detail-item">
          <label>Location:</label>
          <span>{user.location || 'Not provided'}</span>
        </div>
        <div className="detail-item">
          <label>Joined:</label>
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="user-actions">
        <button onClick={() => handleUpdate({ lastSeen: Date.now() })}>
          Update Last Seen
        </button>
        <button onClick={() => fetchUser(userId)}>
          Refresh
        </button>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};

export default UserProfile;
    `.trim();
  }

  private static generateTypeScript(): string {
    return `
// TypeScript file with advanced features
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

type UserRole = User['role'];
type UserUpdate = Partial<Pick<User, 'name' | 'email' | 'preferences'>>;

class UserManager<T extends User = User> {
  private users = new Map<string, T>();
  private observers = new Set<(user: T) => void>();
  
  constructor(private readonly config: { maxUsers: number }) {}
  
  async addUser(userData: Omit<T, 'id'>): Promise<T> {
    if (this.users.size >= this.config.maxUsers) {
      throw new Error('Maximum users reached');
    }
    
    const user = {
      ...userData,
      id: this.generateId(),
    } as T;
    
    this.users.set(user.id, user);
    this.notifyObservers(user);
    
    return user;
  }
  
  getUser(id: string): T | undefined {
    return this.users.get(id);
  }
  
  updateUser(id: string, updates: UserUpdate): T | null {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates } as T;
    this.users.set(id, updatedUser);
    this.notifyObservers(updatedUser);
    
    return updatedUser;
  }
  
  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
  
  getUsersByRole(role: UserRole): T[] {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }
  
  subscribe(callback: (user: T) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  private notifyObservers(user: T): void {
    this.observers.forEach(observer => observer(user));
  }
}

// Generic utility functions
function createUserManager<T extends User>(config: { maxUsers: number }): UserManager<T> {
  return new UserManager<T>(config);
}

function isAdmin(user: User): user is User & { role: 'admin' } {
  return user.role === 'admin';
}

async function fetchUserData(id: string): Promise<User | null> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

export { UserManager, createUserManager, isAdmin, fetchUserData };
export type { User, UserPreferences, UserRole, UserUpdate };
    `.trim();
  }

  private static generateReactTypeScript(): string {
    return `
import React, { useState, useEffect, useCallback } from 'react';

interface Props {
  initialCount?: number;
  onCountChange?: (count: number) => void;
  disabled?: boolean;
}

interface CounterState {
  count: number;
  history: number[];
  lastUpdated: Date;
}

const Counter: React.FC<Props> = ({ 
  initialCount = 0, 
  onCountChange, 
  disabled = false 
}) => {
  const [state, setState] = useState<CounterState>({
    count: initialCount,
    history: [initialCount],
    lastUpdated: new Date(),
  });
  
  const updateCount = useCallback((newCount: number) => {
    setState(prev => ({
      count: newCount,
      history: [...prev.history, newCount],
      lastUpdated: new Date(),
    }));
    onCountChange?.(newCount);
  }, [onCountChange]);
  
  const increment = useCallback(() => {
    if (!disabled) {
      updateCount(state.count + 1);
    }
  }, [state.count, disabled, updateCount]);
  
  const decrement = useCallback(() => {
    if (!disabled) {
      updateCount(state.count - 1);
    }
  }, [state.count, disabled, updateCount]);
  
  const reset = useCallback(() => {
    if (!disabled) {
      updateCount(initialCount);
    }
  }, [initialCount, disabled, updateCount]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(\`Current count: \${state.count}\`);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [state.count]);
  
  return (
    <div className="counter">
      <div className="counter-display">
        <span className="count">{state.count}</span>
        <small className="last-updated">
          Last updated: {state.lastUpdated.toLocaleTimeString()}
        </small>
      </div>
      
      <div className="counter-controls">
        <button 
          onClick={decrement} 
          disabled={disabled}
          aria-label="Decrease count"
        >
          -
        </button>
        <button 
          onClick={increment} 
          disabled={disabled}
          aria-label="Increase count"
        >
          +
        </button>
        <button 
          onClick={reset} 
          disabled={disabled}
          aria-label="Reset count"
        >
          Reset
        </button>
      </div>
      
      <div className="counter-history">
        <h4>History:</h4>
        <ul>
          {state.history.slice(-5).map((count, index) => (
            <li key={index}>{count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Counter;
    `.trim();
  }

  private static generateLargeBundle(): string {
    // Generate a larger file with repetitive patterns
    const functions = [];
    for (let i = 0; i < 100; i++) {
      functions.push(`
function process${i}(data) {
  const result = data.map(item => ({
    ...item,
    processed: true,
    index: ${i},
    timestamp: Date.now(),
  }));
  
  return result.filter(item => item.value > ${i});
}
      `);
    }
    
    return functions.join('\n') + `
export { ${functions.map((_, i) => `process${i}`).join(', ')} };
    `;
  }
}

/**
 * Quick benchmark function for simple comparisons
 */
export async function quickBenchmark(
  testCode: string,
  options: CompilerOptions = {}
): Promise<{ swc: number; babel: number; improvement: number }> {
  const swcCompiler = new SWCCompiler(options);
  const babelCompiler = new BabelCompiler(options);
  
  // Warm up
  await swcCompiler.transform(testCode, 'test.js');
  await babelCompiler.transform(testCode, 'test.js');
  
  // Benchmark SWC
  const swcStart = performance.now();
  await swcCompiler.transform(testCode, 'test.js');
  const swcTime = performance.now() - swcStart;
  
  // Benchmark Babel
  const babelStart = performance.now();
  await babelCompiler.transform(testCode, 'test.js');
  const babelTime = performance.now() - babelStart;
  
  const improvement = ((babelTime - swcTime) / babelTime) * 100;
  
  return {
    swc: swcTime,
    babel: babelTime,
    improvement,
  };
}