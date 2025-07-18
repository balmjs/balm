/**
 * Base bundler interface and abstract class for BalmJS
 * Provides a unified interface for different bundlers (Webpack, Vite, Rollup, ESBuild)
 */

export interface BundlerOptions {
  mode?: 'development' | 'production';
  entry?: string | string[] | { [key: string]: string };
  output?: {
    path?: string;
    filename?: string;
    publicPath?: string;
    clean?: boolean;
  };
  resolve?: {
    extensions?: string[];
    alias?: { [key: string]: string };
  };
  devServer?: {
    port?: number;
    host?: string;
    hot?: boolean;
    open?: boolean;
  };
  optimization?: {
    minimize?: boolean;
    splitChunks?: boolean;
    treeshake?: boolean;
  };
  sourceMap?: boolean | string;
  target?: string | string[];
  externals?: { [key: string]: string };
}

export interface BuildResult {
  success: boolean;
  outputPath: string;
  assets: Asset[];
  chunks: Chunk[];
  errors: BundlerError[];
  warnings: BundlerError[];
  stats: BuildStats;
}

export interface Asset {
  name: string;
  size: number;
  type: 'js' | 'css' | 'html' | 'image' | 'font' | 'other';
  path: string;
}

export interface Chunk {
  id: string;
  name: string;
  size: number;
  files: string[];
  modules: string[];
}

export interface BundlerError {
  type: 'error' | 'warning';
  message: string;
  file?: string;
  line?: number;
  column?: number;
  stack?: string;
}

export interface BuildStats {
  startTime: number;
  endTime: number;
  duration: number;
  bundleSize: number;
  chunkCount: number;
  assetCount: number;
}

export interface DevServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  reload(): Promise<void>;
  getUrl(): string;
  isRunning(): boolean;
}

export interface BundlerConfig {
  name: string;
  version: string;
  options: BundlerOptions;
  supportedFeatures: string[];
}

/**
 * Abstract base class for all bundlers
 */
export abstract class BaseBundler {
  protected options: BundlerOptions;
  protected name: string;
  protected devServer?: DevServer;

  constructor(options: BundlerOptions = {}) {
    this.options = {
      mode: 'development',
      sourceMap: true,
      ...options,
    };
    this.name = this.constructor.name;
    this.validateOptions(this.options);
  }

  /**
   * Build the project
   */
  abstract build(): Promise<BuildResult>;

  /**
   * Start development server
   */
  abstract serve(): Promise<DevServer>;

  /**
   * Watch for file changes and rebuild
   */
  abstract watch(callback?: (result: BuildResult) => void): Promise<void>;

  /**
   * Get bundler configuration
   */
  abstract getConfig(): BundlerConfig;

  /**
   * Check if bundler supports a feature
   */
  abstract supportsFeature(feature: string): boolean;

  /**
   * Get supported features
   */
  abstract getSupportedFeatures(): string[];

  /**
   * Update bundler options
   */
  updateOptions(options: Partial<BundlerOptions>): void {
    this.options = { ...this.options, ...options };
    this.validateOptions(this.options);
  }

  /**
   * Get current options
   */
  getOptions(): BundlerOptions {
    return { ...this.options };
  }

  /**
   * Get development server instance
   */
  getDevServer(): DevServer | undefined {
    return this.devServer;
  }

  /**
   * Validate bundler options
   */
  protected validateOptions(options: BundlerOptions): void {
    if (options.mode && !['development', 'production'].includes(options.mode)) {
      throw new Error(`Invalid mode: ${options.mode}. Must be 'development' or 'production'`);
    }

    if (options.devServer?.port && (options.devServer.port < 1 || options.devServer.port > 65535)) {
      throw new Error(`Invalid port: ${options.devServer.port}. Must be between 1 and 65535`);
    }
  }

  /**
   * Get default options for the bundler
   */
  protected getDefaultOptions(): BundlerOptions {
    return {
      mode: 'development',
      output: {
        path: 'dist',
        filename: '[name].js',
        publicPath: '/',
        clean: true,
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
      devServer: {
        port: 3000,
        host: 'localhost',
        hot: true,
        open: false,
      },
      optimization: {
        minimize: false,
        splitChunks: false,
        treeshake: true,
      },
      sourceMap: true,
    };
  }

  /**
   * Merge options with defaults
   */
  protected mergeOptions(options: BundlerOptions): BundlerOptions {
    const defaults = this.getDefaultOptions();
    return {
      ...defaults,
      ...options,
      output: { ...defaults.output, ...options.output },
      resolve: { ...defaults.resolve, ...options.resolve },
      devServer: { ...defaults.devServer, ...options.devServer },
      optimization: { ...defaults.optimization, ...options.optimization },
    };
  }
}

/**
 * Bundler factory interface
 */
export interface BundlerFactory {
  createBundler(type: string, options?: BundlerOptions): BaseBundler;
  getSupportedBundlers(): string[];
  isBundlerAvailable(type: string): boolean;
}