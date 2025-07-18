/**
 * Intelligent suggestion engine for BalmJS errors
 * Provides context-aware suggestions and solutions for common errors
 */

import { BalmError, ErrorCategory, ErrorSeverity } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Suggestion context information
 */
export interface SuggestionContext {
  /**
   * Current working directory
   */
  cwd?: string;
  
  /**
   * Project package.json content
   */
  packageJson?: any;
  
  /**
   * Available files in the project
   */
  projectFiles?: string[];
  
  /**
   * BalmJS configuration
   */
  balmConfig?: any;
  
  /**
   * Node.js version
   */
  nodeVersion?: string;
  
  /**
   * Environment variables
   */
  env?: Record<string, string>;
  
  /**
   * Recently executed commands
   */
  recentCommands?: string[];
}

/**
 * Suggestion rule interface
 */
export interface SuggestionRule {
  /**
   * Rule identifier
   */
  id: string;
  
  /**
   * Rule name
   */
  name: string;
  
  /**
   * Rule description
   */
  description: string;
  
  /**
   * Error categories this rule applies to
   */
  categories: ErrorCategory[];
  
  /**
   * Error codes this rule applies to (optional, if empty applies to all in categories)
   */
  codes?: string[];
  
  /**
   * Priority of this rule (higher = more important)
   */
  priority: number;
  
  /**
   * Function to check if this rule applies to the error
   */
  matches: (error: BalmError, context: SuggestionContext) => boolean;
  
  /**
   * Function to generate suggestions
   */
  suggest: (error: BalmError, context: SuggestionContext) => string[];
}

/**
 * Suggestion result
 */
export interface SuggestionResult {
  /**
   * Generated suggestions
   */
  suggestions: string[];
  
  /**
   * Rules that were applied
   */
  appliedRules: string[];
  
  /**
   * Context used for suggestions
   */
  context: SuggestionContext;
}

/**
 * Built-in suggestion rules
 */
const BUILTIN_RULES: SuggestionRule[] = [
  // Module not found suggestions
  {
    id: 'module-not-found-install',
    name: 'Module Installation',
    description: 'Suggests installing missing modules',
    categories: [ErrorCategory.COMPILATION, ErrorCategory.DEPENDENCY],
    codes: ['COMPILATION-MODULE-001', 'DEPENDENCY-MISSING-001'],
    priority: 100,
    matches: (error, context) => {
      return error.message.includes('Cannot find module') || 
             error.message.includes('Missing dependency');
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      // Extract module name from error message
      const moduleMatch = error.message.match(/Cannot find module ['"]([^'"]+)['"]/);
      const depMatch = error.message.match(/Missing dependency: ([^\s]+)/);
      const moduleName = moduleMatch?.[1] || depMatch?.[1];
      
      if (moduleName) {
        // Check if it's a relative import that might be a typo
        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
          suggestions.push(`Check if the file path '${moduleName}' is correct`);
          suggestions.push(`Verify that the file '${moduleName}' exists`);
          
          // Suggest similar files if we have project files
          if (context.projectFiles) {
            const similarFiles = findSimilarFiles(moduleName, context.projectFiles);
            if (similarFiles.length > 0) {
              suggestions.push(`Did you mean one of these files? ${similarFiles.slice(0, 3).join(', ')}`);
            }
          }
        } else {
          // It's an npm package
          suggestions.push(`Install the missing package: npm install ${moduleName}`);
          suggestions.push(`Or with yarn: yarn add ${moduleName}`);
          
          // Check if it might be a dev dependency
          if (isLikelyDevDependency(moduleName)) {
            suggestions.push(`If this is a development dependency: npm install --save-dev ${moduleName}`);
          }
          
          // Check for common typos
          const commonPackages = getCommonPackageNames();
          const similar = findSimilarStrings(moduleName, commonPackages);
          if (similar.length > 0) {
            suggestions.push(`Did you mean one of these packages? ${similar.slice(0, 3).join(', ')}`);
          }
        }
      }
      
      return suggestions;
    },
  },
  
  // Configuration errors
  {
    id: 'config-syntax-fix',
    name: 'Configuration Syntax Fix',
    description: 'Suggests fixes for configuration syntax errors',
    categories: [ErrorCategory.CONFIG],
    codes: ['CONFIG-SYNTAX-001'],
    priority: 90,
    matches: (error, context) => {
      return error.code === 'CONFIG-SYNTAX-001';
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      suggestions.push('Check for missing commas, brackets, or quotes in your configuration');
      suggestions.push('Validate your configuration file syntax using a JSON/JavaScript validator');
      suggestions.push('Compare your configuration with the official examples');
      
      // Check if it's a common configuration mistake
      if (error.message.includes('balm.config')) {
        suggestions.push('Ensure your balm.config.js exports a valid configuration object');
        suggestions.push('Check that all required properties are defined');
      }
      
      return suggestions;
    },
  },
  
  // Performance optimization suggestions
  {
    id: 'performance-optimization',
    name: 'Performance Optimization',
    description: 'Suggests performance improvements',
    categories: [ErrorCategory.PERFORMANCE],
    priority: 70,
    matches: (error, context) => {
      return error.category === ErrorCategory.PERFORMANCE;
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      if (error.code.includes('BUILD')) {
        suggestions.push('Enable incremental builds to speed up subsequent builds');
        suggestions.push('Use code splitting to reduce bundle size');
        suggestions.push('Consider using a faster bundler like Vite for development');
        suggestions.push('Enable parallel processing if available');
        
        // Check if SWC is available
        if (context.packageJson?.dependencies?.['@swc/core'] || 
            context.packageJson?.devDependencies?.['@swc/core']) {
          suggestions.push('Consider using SWC instead of Babel for faster compilation');
        } else {
          suggestions.push('Consider installing SWC for faster compilation: npm install --save-dev @swc/core');
        }
      }
      
      if (error.code.includes('MEMORY')) {
        suggestions.push('Increase Node.js memory limit: NODE_OPTIONS=--max_old_space_size=4096');
        suggestions.push('Split your code into smaller chunks');
        suggestions.push('Use dynamic imports to reduce initial bundle size');
        suggestions.push('Check for memory leaks in your code');
      }
      
      if (error.code.includes('BUNDLE')) {
        suggestions.push('Enable tree shaking to remove unused code');
        suggestions.push('Use dynamic imports for large dependencies');
        suggestions.push('Analyze your bundle with webpack-bundle-analyzer');
        suggestions.push('Consider using a CDN for large libraries');
      }
      
      return suggestions;
    },
  },
  
  // Node.js compatibility
  {
    id: 'node-compatibility',
    name: 'Node.js Compatibility',
    description: 'Suggests Node.js version fixes',
    categories: [ErrorCategory.COMPATIBILITY],
    codes: ['COMPATIBILITY-NODE-001'],
    priority: 95,
    matches: (error, context) => {
      return error.code === 'COMPATIBILITY-NODE-001';
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      suggestions.push('Update Node.js to the latest LTS version');
      suggestions.push('Use a Node.js version manager like nvm to switch versions');
      
      if (context.nodeVersion) {
        const currentMajor = parseInt(context.nodeVersion.replace(/^v/, '').split('.')[0]);
        if (currentMajor < 14) {
          suggestions.push('Node.js 14+ is required for modern JavaScript features');
          suggestions.push('Install Node.js 18 LTS for the best compatibility');
        }
      }
      
      suggestions.push('Check your project\'s .nvmrc file if it exists');
      suggestions.push('Update your CI/CD configuration to use the correct Node.js version');
      
      return suggestions;
    },
  },
  
  // Plugin errors
  {
    id: 'plugin-troubleshooting',
    name: 'Plugin Troubleshooting',
    description: 'Suggests plugin-related fixes',
    categories: [ErrorCategory.PLUGIN],
    priority: 80,
    matches: (error, context) => {
      return error.category === ErrorCategory.PLUGIN;
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      if (error.code === 'PLUGIN-NOTFOUND-001') {
        const pluginName = error.metadata?.plugin?.name;
        if (pluginName) {
          suggestions.push(`Install the missing plugin: npm install ${pluginName}`);
          suggestions.push(`Check if the plugin name is spelled correctly: ${pluginName}`);
          
          // Suggest official plugins if it looks like a typo
          const officialPlugins = ['@balm-ui/plugin', '@balm-ui/vue-plugin'];
          const similar = findSimilarStrings(pluginName, officialPlugins);
          if (similar.length > 0) {
            suggestions.push(`Did you mean: ${similar[0]}?`);
          }
        }
      }
      
      if (error.code === 'PLUGIN-COMPATIBILITY-001') {
        suggestions.push('Update the plugin to a compatible version');
        suggestions.push('Check the plugin documentation for compatibility information');
        suggestions.push('Consider using an alternative plugin if available');
      }
      
      if (error.code === 'PLUGIN-EXECUTION-001') {
        suggestions.push('Check the plugin configuration for errors');
        suggestions.push('Verify that all plugin dependencies are installed');
        suggestions.push('Try disabling the plugin temporarily to isolate the issue');
        suggestions.push('Check the plugin\'s GitHub issues for similar problems');
      }
      
      return suggestions;
    },
  },
  
  // File system errors
  {
    id: 'filesystem-fixes',
    name: 'File System Fixes',
    description: 'Suggests file system related fixes',
    categories: [ErrorCategory.FILE_SYSTEM],
    priority: 85,
    matches: (error, context) => {
      return error.category === ErrorCategory.FILE_SYSTEM;
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      if (error.code === 'FILE-SYSTEM-NOTFOUND-001') {
        const filePath = error.location?.filePath;
        if (filePath) {
          suggestions.push(`Check if the file exists: ${filePath}`);
          suggestions.push('Verify the file path is correct');
          
          // Suggest similar files
          if (context.projectFiles) {
            const similar = findSimilarFiles(filePath, context.projectFiles);
            if (similar.length > 0) {
              suggestions.push(`Did you mean: ${similar[0]}?`);
            }
          }
        }
      }
      
      if (error.code === 'FILE-SYSTEM-PERMISSION-001') {
        suggestions.push('Check file and directory permissions');
        suggestions.push('Ensure you have write access to the target directory');
        suggestions.push('Try running with elevated privileges if necessary');
        suggestions.push('Check if the file is locked by another process');
      }
      
      if (error.code === 'FILE-SYSTEM-SPACE-001') {
        suggestions.push('Free up disk space');
        suggestions.push('Clean up node_modules and reinstall dependencies');
        suggestions.push('Clear build artifacts and temporary files');
        suggestions.push('Use a different output directory with more space');
      }
      
      return suggestions;
    },
  },
  
  // Network errors
  {
    id: 'network-troubleshooting',
    name: 'Network Troubleshooting',
    description: 'Suggests network-related fixes',
    categories: [ErrorCategory.NETWORK],
    priority: 75,
    matches: (error, context) => {
      return error.category === ErrorCategory.NETWORK;
    },
    suggest: (error, context) => {
      const suggestions: string[] = [];
      
      suggestions.push('Check your internet connection');
      suggestions.push('Try again in a few minutes');
      
      if (error.code === 'NETWORK-TIMEOUT-001') {
        suggestions.push('Increase the network timeout in your configuration');
        suggestions.push('Check if the server is responding slowly');
      }
      
      if (error.code === 'NETWORK-HTTP-001') {
        const statusCode = error.metadata?.statusCode;
        if (statusCode === 404) {
          suggestions.push('Verify the URL is correct');
          suggestions.push('Check if the resource has been moved or deleted');
        } else if (statusCode === 401 || statusCode === 403) {
          suggestions.push('Check your authentication credentials');
          suggestions.push('Verify you have permission to access the resource');
        } else if (statusCode >= 500) {
          suggestions.push('The server is experiencing issues, try again later');
          suggestions.push('Contact the service provider if the issue persists');
        }
      }
      
      if (error.code === 'NETWORK-SSL-001') {
        suggestions.push('Check if the SSL certificate is valid');
        suggestions.push('Update your system\'s CA certificates');
        suggestions.push('For development, you may need to disable SSL verification');
      }
      
      return suggestions;
    },
  },
];

/**
 * Find similar strings using Levenshtein distance
 */
function findSimilarStrings(target: string, candidates: string[], maxDistance: number = 3): string[] {
  const similar: Array<{ str: string; distance: number }> = [];
  
  for (const candidate of candidates) {
    const distance = levenshteinDistance(target.toLowerCase(), candidate.toLowerCase());
    if (distance <= maxDistance) {
      similar.push({ str: candidate, distance });
    }
  }
  
  return similar
    .sort((a, b) => a.distance - b.distance)
    .map(item => item.str);
}

/**
 * Find similar file paths
 */
function findSimilarFiles(target: string, files: string[]): string[] {
  const targetBasename = path.basename(target);
  const targetDir = path.dirname(target);
  
  // First, look for files with similar names
  const similarNames = findSimilarStrings(targetBasename, files.map(f => path.basename(f)));
  
  // Then, look for files in similar directories
  const similarPaths = files.filter(file => {
    const fileDir = path.dirname(file);
    return levenshteinDistance(targetDir, fileDir) <= 2;
  });
  
  // Combine and deduplicate
  const combined = [...new Set([...similarNames, ...similarPaths])];
  return combined.slice(0, 5);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Check if a package is likely a dev dependency
 */
function isLikelyDevDependency(packageName: string): boolean {
  const devPatterns = [
    /^@types\//,
    /^eslint/,
    /^prettier/,
    /^jest/,
    /^mocha/,
    /^chai/,
    /^webpack/,
    /^babel/,
    /^typescript/,
    /test/,
    /spec/,
    /mock/,
    /stub/,
  ];
  
  return devPatterns.some(pattern => pattern.test(packageName));
}

/**
 * Get common package names for typo detection
 */
function getCommonPackageNames(): string[] {
  return [
    'react', 'vue', 'angular', 'svelte',
    'lodash', 'underscore', 'ramda',
    'axios', 'fetch', 'request',
    'express', 'koa', 'fastify',
    'webpack', 'rollup', 'vite', 'parcel',
    'babel', 'typescript', 'swc',
    'eslint', 'prettier', 'stylelint',
    'jest', 'mocha', 'chai', 'vitest',
    'sass', 'less', 'stylus', 'postcss',
    'moment', 'dayjs', 'date-fns',
    'uuid', 'nanoid', 'shortid',
    'chalk', 'colors', 'kleur',
    'commander', 'yargs', 'inquirer',
    'fs-extra', 'glob', 'rimraf',
    'cross-env', 'dotenv', 'config',
  ];
}

/**
 * Gather context information
 */
async function gatherContext(cwd: string = process.cwd()): Promise<SuggestionContext> {
  const context: SuggestionContext = {
    cwd,
    nodeVersion: process.version,
    env: process.env,
  };
  
  try {
    // Read package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
      context.packageJson = JSON.parse(packageJsonContent);
    }
  } catch (error) {
    // Ignore package.json read errors
  }
  
  try {
    // Read balm config
    const configPaths = [
      'balm.config.js',
      'balm.config.ts',
      'balm.config.mjs',
      '.balmrc.js',
      '.balmrc.json',
    ];
    
    for (const configPath of configPaths) {
      const fullPath = path.join(cwd, configPath);
      if (fs.existsSync(fullPath)) {
        // For now, just note that config exists
        // In a real implementation, we'd parse the config
        context.balmConfig = { exists: true, path: fullPath };
        break;
      }
    }
  } catch (error) {
    // Ignore config read errors
  }
  
  try {
    // Get project files (limited to common source directories)
    const sourceDirs = ['src', 'lib', 'app', 'components', 'pages', 'views'];
    const projectFiles: string[] = [];
    
    for (const dir of sourceDirs) {
      const dirPath = path.join(cwd, dir);
      if (fs.existsSync(dirPath)) {
        const files = getAllFiles(dirPath);
        projectFiles.push(...files.map(f => path.relative(cwd, f)));
      }
    }
    
    context.projectFiles = projectFiles;
  } catch (error) {
    // Ignore file listing errors
  }
  
  return context;
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath: string, maxDepth: number = 3, currentDepth: number = 0): string[] {
  if (currentDepth >= maxDepth) {
    return [];
  }
  
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...getAllFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore directory read errors
  }
  
  return files;
}

/**
 * Suggestion engine class
 */
export class SuggestionEngine {
  private rules: SuggestionRule[] = [];
  private context: SuggestionContext = {};
  
  constructor() {
    // Add built-in rules
    this.rules = [...BUILTIN_RULES];
  }
  
  /**
   * Add a custom suggestion rule
   */
  addRule(rule: SuggestionRule): void {
    this.rules.push(rule);
    // Sort by priority (higher first)
    this.rules.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Remove a suggestion rule
   */
  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index >= 0) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }
  
  /**
   * Get all rules
   */
  getRules(): SuggestionRule[] {
    return [...this.rules];
  }
  
  /**
   * Set context for suggestions
   */
  setContext(context: SuggestionContext): void {
    this.context = { ...this.context, ...context };
  }
  
  /**
   * Get current context
   */
  getContext(): SuggestionContext {
    return { ...this.context };
  }
  
  /**
   * Generate suggestions for an error
   */
  async suggest(error: BalmError, additionalContext?: SuggestionContext): Promise<SuggestionResult> {
    // Gather context if not provided
    let context = { ...this.context };
    if (additionalContext) {
      context = { ...context, ...additionalContext };
    }
    
    // If no context is available, try to gather it
    if (!context.cwd && !context.packageJson) {
      context = await gatherContext();
    }
    
    const suggestions: string[] = [];
    const appliedRules: string[] = [];
    
    // Apply matching rules
    for (const rule of this.rules) {
      // Check if rule applies to this error category
      if (!rule.categories.includes(error.category)) {
        continue;
      }
      
      // Check if rule applies to this error code (if specified)
      if (rule.codes && rule.codes.length > 0 && !rule.codes.includes(error.code)) {
        continue;
      }
      
      // Check if rule matches
      if (!rule.matches(error, context)) {
        continue;
      }
      
      // Generate suggestions
      try {
        const ruleSuggestions = rule.suggest(error, context);
        suggestions.push(...ruleSuggestions);
        appliedRules.push(rule.id);
      } catch (ruleError) {
        // Ignore rule execution errors
        console.warn(`Error executing suggestion rule ${rule.id}:`, ruleError);
      }
    }
    
    // Remove duplicates while preserving order
    const uniqueSuggestions = [...new Set(suggestions)];
    
    return {
      suggestions: uniqueSuggestions,
      appliedRules,
      context,
    };
  }
  
  /**
   * Generate suggestions for multiple errors
   */
  async suggestForErrors(errors: BalmError[], additionalContext?: SuggestionContext): Promise<SuggestionResult[]> {
    const results: SuggestionResult[] = [];
    
    for (const error of errors) {
      const result = await this.suggest(error, additionalContext);
      results.push(result);
    }
    
    return results;
  }
}

/**
 * Global suggestion engine instance
 */
let globalSuggestionEngine: SuggestionEngine | null = null;

/**
 * Get the global suggestion engine
 */
export function getGlobalSuggestionEngine(): SuggestionEngine {
  if (!globalSuggestionEngine) {
    globalSuggestionEngine = new SuggestionEngine();
  }
  return globalSuggestionEngine;
}

/**
 * Set the global suggestion engine
 */
export function setGlobalSuggestionEngine(engine: SuggestionEngine): void {
  globalSuggestionEngine = engine;
}

/**
 * Generate suggestions for an error using the global engine
 */
export async function suggestForError(error: BalmError, context?: SuggestionContext): Promise<SuggestionResult> {
  return getGlobalSuggestionEngine().suggest(error, context);
}

/**
 * Generate suggestions for multiple errors using the global engine
 */
export async function suggestForErrors(errors: BalmError[], context?: SuggestionContext): Promise<SuggestionResult[]> {
  return getGlobalSuggestionEngine().suggestForErrors(errors, context);
}