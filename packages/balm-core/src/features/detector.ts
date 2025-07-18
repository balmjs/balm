/**
 * ES2022+ Modern JavaScript Features Detector for BalmJS
 * Analyzes code to detect usage of modern JavaScript features
 */

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

/**
 * Modern JavaScript feature definition
 */
export interface ModernFeature {
  name: string;
  esVersion: string;
  description: string;
  browserSupport: {
    chrome?: string;
    firefox?: string;
    safari?: string;
    edge?: string;
  };
  nodeSupport?: string;
  polyfillable: boolean;
  polyfillLibrary?: string;
  examples: string[];
}

/**
 * Feature detection result
 */
export interface FeatureDetectionResult {
  feature: ModernFeature;
  locations: FeatureLocation[];
  count: number;
}

/**
 * Feature usage location
 */
export interface FeatureLocation {
  file: string;
  line: number;
  column: number;
  code: string;
  context?: string;
}

/**
 * Detection configuration
 */
export interface DetectionConfig {
  include?: string[];
  exclude?: string[];
  extensions?: string[];
  followImports?: boolean;
  maxDepth?: number;
  ignoreNodeModules?: boolean;
}

/**
 * Detection summary
 */
export interface DetectionSummary {
  totalFiles: number;
  totalFeatures: number;
  featuresUsed: FeatureDetectionResult[];
  compatibility: {
    esVersion: string;
    browserSupport: string[];
    nodeSupport?: string;
    polyfillsNeeded: string[];
  };
  recommendations: string[];
}

/**
 * Modern JavaScript features database
 */
export const MODERN_FEATURES: Record<string, ModernFeature> = {
  // ES2022 Features
  topLevelAwait: {
    name: 'Top-level await',
    esVersion: 'ES2022',
    description: 'Await expressions at the top level of modules',
    browserSupport: {
      chrome: '89',
      firefox: '89',
      safari: '15',
      edge: '89',
    },
    nodeSupport: '14.8.0',
    polyfillable: false,
    examples: [
      'const data = await fetch("/api/data");',
      'await import("./module.js");',
    ],
  },

  privateFields: {
    name: 'Private class fields',
    esVersion: 'ES2022',
    description: 'Private fields in classes using # syntax',
    browserSupport: {
      chrome: '74',
      firefox: '90',
      safari: '14.1',
      edge: '79',
    },
    nodeSupport: '12.0.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-private-methods',
    examples: [
      'class MyClass { #privateField = 42; }',
      'class MyClass { #privateMethod() {} }',
    ],
  },

  privateMethods: {
    name: 'Private class methods',
    esVersion: 'ES2022',
    description: 'Private methods in classes using # syntax',
    browserSupport: {
      chrome: '84',
      firefox: '90',
      safari: '15',
      edge: '84',
    },
    nodeSupport: '14.6.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-private-methods',
    examples: [
      'class MyClass { #privateMethod() { return 42; } }',
    ],
  },

  staticBlocks: {
    name: 'Static class blocks',
    esVersion: 'ES2022',
    description: 'Static initialization blocks in classes',
    browserSupport: {
      chrome: '94',
      firefox: '93',
      safari: '16',
      edge: '94',
    },
    nodeSupport: '16.11.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-class-static-block',
    examples: [
      'class MyClass { static { this.staticProperty = 42; } }',
    ],
  },

  publicFields: {
    name: 'Public class fields',
    esVersion: 'ES2022',
    description: 'Public fields in classes',
    browserSupport: {
      chrome: '72',
      firefox: '69',
      safari: '14',
      edge: '79',
    },
    nodeSupport: '12.0.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-class-properties',
    examples: [
      'class MyClass { publicField = 42; }',
    ],
  },

  // ES2021 Features
  logicalAssignment: {
    name: 'Logical assignment operators',
    esVersion: 'ES2021',
    description: 'Logical assignment operators (??=, ||=, &&=)',
    browserSupport: {
      chrome: '85',
      firefox: '79',
      safari: '14',
      edge: '85',
    },
    nodeSupport: '15.0.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-logical-assignment-operators',
    examples: [
      'a ??= b;',
      'a ||= b;',
      'a &&= b;',
    ],
  },

  numericSeparators: {
    name: 'Numeric separators',
    esVersion: 'ES2021',
    description: 'Underscores in numeric literals for readability',
    browserSupport: {
      chrome: '75',
      firefox: '70',
      safari: '13',
      edge: '79',
    },
    nodeSupport: '12.5.0',
    polyfillable: false,
    examples: [
      '1_000_000',
      '0b1010_0001',
      '0xFF_EC_DE_5E',
    ],
  },

  // ES2020 Features
  optionalChaining: {
    name: 'Optional chaining',
    esVersion: 'ES2020',
    description: 'Safe property access with ?. operator',
    browserSupport: {
      chrome: '80',
      firefox: '72',
      safari: '13.1',
      edge: '80',
    },
    nodeSupport: '14.0.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-optional-chaining',
    examples: [
      'obj?.prop?.method?.()',
      'arr?.[0]?.value',
    ],
  },

  nullishCoalescing: {
    name: 'Nullish coalescing',
    esVersion: 'ES2020',
    description: 'Nullish coalescing operator (??)',
    browserSupport: {
      chrome: '80',
      firefox: '72',
      safari: '13.1',
      edge: '80',
    },
    nodeSupport: '14.0.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-proposal-nullish-coalescing-operator',
    examples: [
      'value ?? defaultValue',
      'obj.prop ?? "default"',
    ],
  },

  bigInt: {
    name: 'BigInt',
    esVersion: 'ES2020',
    description: 'Arbitrary precision integers',
    browserSupport: {
      chrome: '67',
      firefox: '68',
      safari: '14',
      edge: '79',
    },
    nodeSupport: '10.4.0',
    polyfillable: true,
    polyfillLibrary: 'big-integer',
    examples: [
      '123n',
      'BigInt(123)',
    ],
  },

  dynamicImport: {
    name: 'Dynamic import',
    esVersion: 'ES2020',
    description: 'Dynamic module imports',
    browserSupport: {
      chrome: '63',
      firefox: '67',
      safari: '11.1',
      edge: '79',
    },
    nodeSupport: '13.2.0',
    polyfillable: true,
    polyfillLibrary: '@babel/plugin-syntax-dynamic-import',
    examples: [
      'import("./module.js")',
      'const module = await import("./module.js")',
    ],
  },
};

/**
 * Modern JavaScript features detector
 */
export class ModernFeaturesDetector {
  private config: DetectionConfig;
  private results: Map<string, FeatureDetectionResult> = new Map();

  constructor(config: DetectionConfig = {}) {
    this.config = {
      include: ['src/**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      exclude: ['node_modules/**', 'dist/**', 'build/**'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      followImports: false,
      maxDepth: 3,
      ignoreNodeModules: true,
      ...config,
    };
  }

  /**
   * Detect modern features in the project
   */
  async detectFeatures(rootPath: string = process.cwd()): Promise<DetectionSummary> {
    console.log('🔍 Detecting modern JavaScript features...');
    
    // Get files to analyze
    const files = await this.getFilesToAnalyze(rootPath);
    console.log(`📁 Analyzing ${files.length} files...`);

    // Reset results
    this.results.clear();

    // Analyze each file
    for (const file of files) {
      try {
        await this.analyzeFile(file);
      } catch (error) {
        console.warn(`⚠️  Failed to analyze ${file}: ${error.message}`);
      }
    }

    // Generate summary
    const summary = this.generateSummary(files.length);
    console.log(`✅ Detection complete. Found ${summary.totalFeatures} modern features.`);

    return summary;
  }

  /**
   * Detect features in a single file
   */
  async detectInFile(filePath: string): Promise<FeatureDetectionResult[]> {
    await this.analyzeFile(filePath);
    return Array.from(this.results.values()).filter(result => 
      result.locations.some(loc => loc.file === filePath)
    );
  }

  /**
   * Check if a specific feature is used
   */
  isFeatureUsed(featureName: string): boolean {
    return this.results.has(featureName);
  }

  /**
   * Get usage locations for a specific feature
   */
  getFeatureLocations(featureName: string): FeatureLocation[] {
    const result = this.results.get(featureName);
    return result ? result.locations : [];
  }

  // Private methods

  private async getFilesToAnalyze(rootPath: string): Promise<string[]> {
    const files: string[] = [];

    for (const pattern of this.config.include || []) {
      const matchedFiles = await glob(pattern, {
        cwd: rootPath,
        ignore: this.config.exclude,
        absolute: true,
      });
      files.push(...matchedFiles);
    }

    return [...new Set(files)].filter(file => 
      this.config.extensions?.some(ext => file.endsWith(ext))
    );
  }

  private async analyzeFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      // Parse the file
      const ast = parse(content, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: [
          'jsx',
          'typescript',
          'decorators-legacy',
          'classProperties',
          'classPrivateProperties',
          'classPrivateMethods',
          'classStaticBlock',
          'topLevelAwait',
          'optionalChaining',
          'nullishCoalescingOperator',
          'logicalAssignmentOperators',
          'numericSeparator',
          'bigInt',
          'dynamicImport',
        ],
      });

      // Traverse and detect features
      traverse(ast, {
        // Top-level await
        AwaitExpression: (path) => {
          if (this.isTopLevelAwait(path)) {
            this.recordFeature('topLevelAwait', filePath, path.node, content);
          }
        },

        // Private fields and methods
        ClassPrivateProperty: (path) => {
          this.recordFeature('privateFields', filePath, path.node, content);
        },

        ClassPrivateMethod: (path) => {
          this.recordFeature('privateMethods', filePath, path.node, content);
        },

        // Static blocks
        StaticBlock: (path) => {
          this.recordFeature('staticBlocks', filePath, path.node, content);
        },

        // Public class fields
        ClassProperty: (path) => {
          if (!path.node.static && !t.isPrivateName(path.node.key)) {
            this.recordFeature('publicFields', filePath, path.node, content);
          }
        },

        // Logical assignment operators
        AssignmentExpression: (path) => {
          if (['??=', '||=', '&&='].includes(path.node.operator)) {
            this.recordFeature('logicalAssignment', filePath, path.node, content);
          }
        },

        // Numeric separators
        NumericLiteral: (path) => {
          if (path.node.extra?.raw?.includes('_')) {
            this.recordFeature('numericSeparators', filePath, path.node, content);
          }
        },

        // Optional chaining
        OptionalMemberExpression: (path) => {
          this.recordFeature('optionalChaining', filePath, path.node, content);
        },

        OptionalCallExpression: (path) => {
          this.recordFeature('optionalChaining', filePath, path.node, content);
        },

        // Nullish coalescing
        LogicalExpression: (path) => {
          if (path.node.operator === '??') {
            this.recordFeature('nullishCoalescing', filePath, path.node, content);
          }
        },

        // BigInt
        BigIntLiteral: (path) => {
          this.recordFeature('bigInt', filePath, path.node, content);
        },

        // Dynamic import
        CallExpression: (path) => {
          if (t.isImport(path.node.callee)) {
            this.recordFeature('dynamicImport', filePath, path.node, content);
          }
        },
      });

    } catch (error) {
      console.warn(`⚠️  Parse error in ${relativePath}: ${error.message}`);
    }
  }

  private isTopLevelAwait(path: any): boolean {
    let parent = path.parent;
    while (parent) {
      if (t.isFunction(parent) || t.isArrowFunctionExpression(parent)) {
        return false;
      }
      if (t.isProgram(parent)) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  private recordFeature(
    featureName: string,
    filePath: string,
    node: any,
    content: string
  ): void {
    const feature = MODERN_FEATURES[featureName];
    if (!feature) return;

    const location: FeatureLocation = {
      file: path.relative(process.cwd(), filePath),
      line: node.loc?.start.line || 0,
      column: node.loc?.start.column || 0,
      code: this.extractCode(content, node),
      context: this.extractContext(content, node),
    };

    if (!this.results.has(featureName)) {
      this.results.set(featureName, {
        feature,
        locations: [],
        count: 0,
      });
    }

    const result = this.results.get(featureName)!;
    result.locations.push(location);
    result.count++;
  }

  private extractCode(content: string, node: any): string {
    if (!node.loc) return '';
    
    const lines = content.split('\n');
    const startLine = node.loc.start.line - 1;
    const endLine = node.loc.end.line - 1;
    
    if (startLine === endLine) {
      const line = lines[startLine];
      return line.slice(node.loc.start.column, node.loc.end.column);
    }
    
    const result = [];
    for (let i = startLine; i <= endLine; i++) {
      if (i === startLine) {
        result.push(lines[i].slice(node.loc.start.column));
      } else if (i === endLine) {
        result.push(lines[i].slice(0, node.loc.end.column));
      } else {
        result.push(lines[i]);
      }
    }
    
    return result.join('\n');
  }

  private extractContext(content: string, node: any): string {
    if (!node.loc) return '';
    
    const lines = content.split('\n');
    const startLine = Math.max(0, node.loc.start.line - 3);
    const endLine = Math.min(lines.length - 1, node.loc.end.line + 1);
    
    return lines.slice(startLine, endLine + 1).join('\n');
  }

  private generateSummary(totalFiles: number): DetectionSummary {
    const featuresUsed = Array.from(this.results.values());
    const esVersions = featuresUsed.map(f => f.feature.esVersion);
    const highestESVersion = this.getHighestESVersion(esVersions);
    
    const polyfillsNeeded = featuresUsed
      .filter(f => f.feature.polyfillable && f.feature.polyfillLibrary)
      .map(f => f.feature.polyfillLibrary!)
      .filter((lib, index, arr) => arr.indexOf(lib) === index);

    const browserSupport = this.calculateBrowserSupport(featuresUsed);
    const recommendations = this.generateRecommendations(featuresUsed);

    return {
      totalFiles,
      totalFeatures: featuresUsed.length,
      featuresUsed,
      compatibility: {
        esVersion: highestESVersion,
        browserSupport,
        polyfillsNeeded,
      },
      recommendations,
    };
  }

  private getHighestESVersion(versions: string[]): string {
    const versionOrder = ['ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', 'ES2022', 'ES2023'];
    let highest = 'ES2015';
    
    for (const version of versions) {
      if (versionOrder.indexOf(version) > versionOrder.indexOf(highest)) {
        highest = version;
      }
    }
    
    return highest;
  }

  private calculateBrowserSupport(features: FeatureDetectionResult[]): string[] {
    const browsers = ['chrome', 'firefox', 'safari', 'edge'] as const;
    const support: Record<string, string> = {};
    
    for (const browser of browsers) {
      let minVersion = '0';
      
      for (const feature of features) {
        const browserVersion = feature.feature.browserSupport[browser];
        if (browserVersion && this.compareVersions(browserVersion, minVersion) > 0) {
          minVersion = browserVersion;
        }
      }
      
      if (minVersion !== '0') {
        support[browser] = minVersion;
      }
    }
    
    return Object.entries(support).map(([browser, version]) => `${browser} ${version}+`);
  }

  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      
      if (aPart > bPart) return 1;
      if (aPart < bPart) return -1;
    }
    
    return 0;
  }

  private generateRecommendations(features: FeatureDetectionResult[]): string[] {
    const recommendations: string[] = [];
    
    if (features.length === 0) {
      recommendations.push('No modern JavaScript features detected. Consider using modern syntax for better code quality.');
      return recommendations;
    }
    
    const polyfillableFeatures = features.filter(f => f.feature.polyfillable);
    if (polyfillableFeatures.length > 0) {
      recommendations.push(`Consider adding polyfills for ${polyfillableFeatures.length} features to support older browsers.`);
    }
    
    const nonPolyfillableFeatures = features.filter(f => !f.feature.polyfillable);
    if (nonPolyfillableFeatures.length > 0) {
      recommendations.push(`${nonPolyfillableFeatures.length} features cannot be polyfilled and require modern browser support.`);
    }
    
    const topLevelAwait = features.find(f => f.feature.name === 'Top-level await');
    if (topLevelAwait) {
      recommendations.push('Top-level await requires ES modules and modern bundler support.');
    }
    
    const privateFields = features.find(f => f.feature.name === 'Private class fields');
    if (privateFields) {
      recommendations.push('Private class fields provide better encapsulation than convention-based private properties.');
    }
    
    return recommendations;
  }
}

/**
 * Create a features detector instance
 */
export function createFeaturesDetector(config?: DetectionConfig): ModernFeaturesDetector {
  return new ModernFeaturesDetector(config);
}

/**
 * Quick feature detection for a project
 */
export async function detectModernFeatures(
  rootPath: string = process.cwd(),
  config?: DetectionConfig
): Promise<DetectionSummary> {
  const detector = createFeaturesDetector(config);
  return detector.detectFeatures(rootPath);
}

/**
 * Check if specific features are used in a project
 */
export async function checkFeatureUsage(
  features: string[],
  rootPath: string = process.cwd(),
  config?: DetectionConfig
): Promise<Record<string, boolean>> {
  const detector = createFeaturesDetector(config);
  await detector.detectFeatures(rootPath);
  
  const result: Record<string, boolean> = {};
  for (const feature of features) {
    result[feature] = detector.isFeatureUsed(feature);
  }
  
  return result;
}

/**
 * Generate a features report
 */
export function generateFeaturesReport(summary: DetectionSummary): string {
  const lines: string[] = [];
  
  lines.push('# Modern JavaScript Features Report');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push(`**Files Analyzed:** ${summary.totalFiles}`);
  lines.push(`**Features Found:** ${summary.totalFeatures}`);
  lines.push('');
  
  // Compatibility summary
  lines.push('## Compatibility Summary');
  lines.push(`**Target ES Version:** ${summary.compatibility.esVersion}`);
  lines.push(`**Browser Support:** ${summary.compatibility.browserSupport.join(', ')}`);
  if (summary.compatibility.polyfillsNeeded.length > 0) {
    lines.push(`**Polyfills Needed:** ${summary.compatibility.polyfillsNeeded.join(', ')}`);
  }
  lines.push('');
  
  // Features used
  if (summary.featuresUsed.length > 0) {
    lines.push('## Features Used');
    lines.push('');
    
    for (const feature of summary.featuresUsed) {
      lines.push(`### ${feature.feature.name} (${feature.feature.esVersion})`);
      lines.push(`**Usage Count:** ${feature.count}`);
      lines.push(`**Description:** ${feature.feature.description}`);
      lines.push(`**Polyfillable:** ${feature.feature.polyfillable ? 'Yes' : 'No'}`);
      if (feature.feature.polyfillLibrary) {
        lines.push(`**Polyfill Library:** ${feature.feature.polyfillLibrary}`);
      }
      lines.push('');
      
      // Show first few locations
      const locationsToShow = feature.locations.slice(0, 5);
      lines.push('**Usage Locations:**');
      for (const location of locationsToShow) {
        lines.push(`- ${location.file}:${location.line}:${location.column}`);
        lines.push(`  \`${location.code.replace(/\n/g, ' ')}\``);
      }
      
      if (feature.locations.length > 5) {
        lines.push(`- ... and ${feature.locations.length - 5} more locations`);
      }
      lines.push('');
    }
  }
  
  // Recommendations
  if (summary.recommendations.length > 0) {
    lines.push('## Recommendations');
    lines.push('');
    for (const recommendation of summary.recommendations) {
      lines.push(`- ${recommendation}`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}