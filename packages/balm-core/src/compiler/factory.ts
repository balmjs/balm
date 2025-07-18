/**
 * Compiler factory implementation
 * Manages creation and registration of different compilers
 */

import { BaseCompiler, CompilerOptions, CompilerFactory } from './base.js';

export type CompilerType = 'babel' | 'swc' | 'typescript';

interface CompilerConstructor {
  new (options?: CompilerOptions): BaseCompiler;
}

/**
 * Factory class for creating compiler instances
 */
export class DefaultCompilerFactory implements CompilerFactory {
  private compilers = new Map<string, CompilerConstructor>();
  private instances = new Map<string, BaseCompiler>();

  constructor() {
    this.registerDefaultCompilers();
  }

  /**
   * Register default compilers
   */
  private registerDefaultCompilers(): void {
    // Babel compiler - always available as fallback
    try {
      const { BabelCompiler } = require('./babel/index.js');
      this.registerCompiler('babel', BabelCompiler);
    } catch (error) {
      BalmJS.logger?.warn?.('compiler-factory', 'Babel compiler not available');
    }
    
    // SWC compiler will be registered when available
    try {
      const { SWCCompiler } = require('./swc/index.js');
      this.registerCompiler('swc', SWCCompiler);
    } catch (error) {
      // SWC not available, skip registration
      BalmJS.logger?.debug?.('compiler-factory', 'SWC compiler not available');
    }

    // TypeScript compiler registration
    try {
      const { TypeScriptCompiler } = require('./typescript/index.js');
      this.registerCompiler('typescript', TypeScriptCompiler);
    } catch (error) {
      // TypeScript compiler not available, skip registration
      BalmJS.logger?.debug?.('compiler-factory', 'TypeScript compiler not available');
    }
  }

  /**
   * Register a compiler
   */
  registerCompiler(type: string, CompilerClass: CompilerConstructor): void {
    this.compilers.set(type, CompilerClass);
  }

  /**
   * Create a compiler instance
   */
  createCompiler(type: string, options?: CompilerOptions): BaseCompiler {
    const cacheKey = `${type}-${JSON.stringify(options || {})}`;
    
    // Return cached instance if available
    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey)!;
    }

    const CompilerClass = this.compilers.get(type);
    if (!CompilerClass) {
      throw new Error(`Compiler type '${type}' is not registered`);
    }

    try {
      const compiler = new CompilerClass(options);
      this.instances.set(cacheKey, compiler);
      return compiler;
    } catch (error) {
      throw new Error(`Failed to create compiler '${type}': ${error.message}`);
    }
  }

  /**
   * Get supported compiler types
   */
  getSupportedCompilers(): string[] {
    return Array.from(this.compilers.keys());
  }

  /**
   * Check if a compiler is available
   */
  isCompilerAvailable(type: string): boolean {
    return this.compilers.has(type);
  }

  /**
   * Get the best available compiler for a file
   */
  getBestCompilerForFile(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    // Prefer SWC for performance if available
    if (this.isCompilerAvailable('swc')) {
      const swcCompiler = this.createCompiler('swc');
      if (swcCompiler.supportsExtension(extension || '')) {
        return 'swc';
      }
    }

    // Fall back to Babel
    if (this.isCompilerAvailable('babel')) {
      const babelCompiler = this.createCompiler('babel');
      if (babelCompiler.supportsExtension(extension || '')) {
        return 'babel';
      }
    }

    // TypeScript for .ts/.tsx files
    if (extension === 'ts' || extension === 'tsx') {
      if (this.isCompilerAvailable('typescript')) {
        return 'typescript';
      }
    }

    // Default to babel
    return 'babel';
  }

  /**
   * Clear cached instances
   */
  clearCache(): void {
    this.instances.clear();
  }

  /**
   * Get compiler statistics
   */
  getStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    for (const type of this.getSupportedCompilers()) {
      stats[type] = Array.from(this.instances.keys())
        .filter(key => key.startsWith(type))
        .length;
    }
    return stats;
  }
}

// Export singleton instance
export const compilerFactory = new DefaultCompilerFactory();