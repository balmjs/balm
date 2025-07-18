/**
 * Base compiler interface and abstract class for BalmJS
 * Provides a unified interface for different JavaScript/TypeScript compilers
 */

export interface CompilerOptions {
  target?: 'es5' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'es2022' | 'esnext';
  module?: 'commonjs' | 'amd' | 'umd' | 'es6' | 'es2015' | 'es2020' | 'esnext';
  jsx?: 'preserve' | 'react' | 'react-jsx' | 'react-jsxdev';
  sourceMap?: boolean;
  minify?: boolean;
  declaration?: boolean;
  strict?: boolean;
  experimentalDecorators?: boolean;
  emitDecoratorMetadata?: boolean;
}

export interface TransformResult {
  code: string;
  map?: string;
  declarations?: string;
}

export interface MinifyResult {
  code: string;
  map?: string;
}

export interface CompilerConfig {
  name: string;
  version: string;
  options: CompilerOptions;
  extensions: string[];
}

/**
 * Abstract base class for all compilers
 */
export abstract class BaseCompiler {
  protected options: CompilerOptions;
  protected name: string;

  constructor(options: CompilerOptions = {}) {
    this.options = {
      target: 'es2020',
      module: 'es6',
      sourceMap: true,
      minify: false,
      ...options,
    };
    this.name = this.constructor.name;
  }

  /**
   * Transform source code
   */
  abstract transform(code: string, filename: string): Promise<TransformResult>;

  /**
   * Transform a file
   */
  abstract transformFile(filename: string): Promise<TransformResult>;

  /**
   * Minify code
   */
  abstract minify(code: string, filename?: string): Promise<MinifyResult>;

  /**
   * Get compiler configuration
   */
  abstract getConfig(): CompilerConfig;

  /**
   * Check if compiler supports a file extension
   */
  abstract supportsExtension(extension: string): boolean;

  /**
   * Get supported file extensions
   */
  abstract getSupportedExtensions(): string[];

  /**
   * Update compiler options
   */
  updateOptions(options: Partial<CompilerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get current options
   */
  getOptions(): CompilerOptions {
    return { ...this.options };
  }

  /**
   * Validate options
   */
  protected validateOptions(options: CompilerOptions): void {
    // Basic validation - can be overridden by specific compilers
    if (options.target && !this.isValidTarget(options.target)) {
      throw new Error(`Invalid target: ${options.target}`);
    }
    if (options.module && !this.isValidModule(options.module)) {
      throw new Error(`Invalid module: ${options.module}`);
    }
  }

  private isValidTarget(target: string): boolean {
    const validTargets = ['es5', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'esnext'];
    return validTargets.includes(target);
  }

  private isValidModule(module: string): boolean {
    const validModules = ['commonjs', 'amd', 'umd', 'es6', 'es2015', 'es2020', 'esnext'];
    return validModules.includes(module);
  }
}

/**
 * Compiler factory interface
 */
export interface CompilerFactory {
  createCompiler(type: string, options?: CompilerOptions): BaseCompiler;
  getSupportedCompilers(): string[];
  isCompilerAvailable(type: string): boolean;
}