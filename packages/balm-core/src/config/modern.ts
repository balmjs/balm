/**
 * Modern BalmJS configuration system
 * Provides type-safe configuration with validation and migration support
 */

import { BalmConfig } from '@balm-core/index';
import { CompilerOptions } from '../compiler/base.js';
import { BundlerOptions } from '../bundler/base.js';

/**
 * Modern configuration interface extending the existing BalmConfig
 */
export interface ModernBalmConfig extends Omit<BalmConfig, 'scripts'> {
  // Compiler configuration
  compiler: {
    type: 'babel' | 'swc' | 'typescript';
    options?: CompilerOptions;
    // SWC specific options
    swc?: {
      jsc?: {
        parser?: {
          syntax: 'typescript' | 'ecmascript';
          tsx?: boolean;
          decorators?: boolean;
          dynamicImport?: boolean;
        };
        target?: 'es3' | 'es5' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'es2022' | 'esnext';
        loose?: boolean;
        externalHelpers?: boolean;
        keepClassNames?: boolean;
        transform?: {
          react?: {
            runtime?: 'automatic' | 'classic';
            importSource?: string;
            pragma?: string;
            pragmaFrag?: string;
            throwIfNamespace?: boolean;
            development?: boolean;
            useBuiltins?: boolean;
            refresh?: boolean;
          };
          optimizer?: {
            globals?: {
              vars?: Record<string, string>;
              typeofs?: Record<string, string>;
            };
            jsonify?: {
              minCost?: number;
            };
          };
          decoratorMetadata?: boolean;
          legacyDecorator?: boolean;
        };
      };
      module?: {
        type?: 'commonjs' | 'umd' | 'amd' | 'es6';
        strict?: boolean;
        strictMode?: boolean;
        lazy?: boolean;
        noInterop?: boolean;
      };
      minify?: boolean | {
        compress?: boolean | object;
        mangle?: boolean | object;
        format?: object;
        ecma?: number;
        keep_classnames?: boolean;
        keep_fnames?: boolean;
        safari10?: boolean;
        toplevel?: boolean;
      };
      sourceMaps?: boolean | 'inline';
      inlineSourcesContent?: boolean;
    };
    // Babel specific options (for backward compatibility)
    babel?: {
      presets?: any[];
      plugins?: any[];
      babelrc?: boolean;
      configFile?: boolean | string;
      envName?: string;
    };
  };

  // Bundler configuration
  bundler: {
    type: 'webpack' | 'vite' | 'rollup' | 'esbuild';
    options?: BundlerOptions;
    // Vite specific options
    vite?: {
      plugins?: any[];
      css?: {
        modules?: boolean | object;
        preprocessorOptions?: {
          scss?: object;
          sass?: object;
          less?: object;
          stylus?: object;
        };
        postcss?: object;
      };
      build?: {
        target?: string | string[];
        polyfillModulePreload?: boolean;
        outDir?: string;
        assetsDir?: string;
        assetsInlineLimit?: number;
        cssCodeSplit?: boolean;
        cssTarget?: string | string[];
        sourcemap?: boolean | 'inline' | 'hidden';
        rollupOptions?: object;
        lib?: {
          entry: string | string[] | { [entryAlias: string]: string };
          name?: string;
          formats?: ('es' | 'cjs' | 'umd' | 'iife')[];
          fileName?: string | ((format: string, entryName: string) => string);
        };
        manifest?: boolean | string;
        ssrManifest?: boolean | string;
        ssr?: boolean | string;
        minify?: boolean | 'terser' | 'esbuild';
        terserOptions?: object;
        write?: boolean;
        emptyOutDir?: boolean;
        copyPublicDir?: boolean;
        reportCompressedSize?: boolean;
        chunkSizeWarningLimit?: number;
        watch?: object;
      };
      server?: {
        host?: string | boolean;
        port?: number;
        strictPort?: boolean;
        https?: boolean | object;
        open?: boolean | string | string[];
        proxy?: Record<string, string | object>;
        cors?: boolean | object;
        headers?: Record<string, string>;
        hmr?: boolean | { port?: number; host?: string };
        watch?: {
          ignored?: string | RegExp | (string | RegExp)[];
          usePolling?: boolean;
          interval?: number;
          binaryInterval?: number;
        };
        middlewareMode?: boolean | 'html' | 'ssr';
        fs?: {
          strict?: boolean;
          allow?: string[];
          deny?: string[];
        };
        origin?: string;
      };
      preview?: {
        host?: string | boolean;
        port?: number;
        strictPort?: boolean;
        https?: boolean | object;
        open?: boolean | string | string[];
        proxy?: Record<string, string | object>;
        cors?: boolean | object;
        headers?: Record<string, string>;
      };
    };
    // Webpack specific options (existing)
    webpack?: {
      entry?: any;
      output?: any;
      module?: any;
      plugins?: any[];
      resolve?: any;
      optimization?: any;
      devServer?: any;
      devtool?: any;
      target?: any;
      externals?: any;
      mode?: 'development' | 'production' | 'none';
      stats?: any;
    };
  };

  // Target environment configuration
  target: {
    browsers?: string | string[];
    node?: string;
    esVersion: 'es5' | 'es2015' | 'es2016' | 'es2017' | 'es2018' | 'es2019' | 'es2020' | 'es2021' | 'es2022' | 'esnext';
    // Modern JavaScript features support
    features?: {
      topLevelAwait?: boolean;
      privateFields?: boolean;
      staticBlocks?: boolean;
      logicalAssignment?: boolean;
      numericSeparators?: boolean;
      optionalChaining?: boolean;
      nullishCoalescing?: boolean;
      dynamicImport?: boolean;
      importMeta?: boolean;
      bigint?: boolean;
      decorators?: boolean;
    };
  };

  // Feature flags
  features: {
    hmr: boolean;
    splitting: boolean;
    treeshaking: boolean;
    minification: boolean;
    sourceMap: boolean | 'inline' | 'hidden';
    cssExtraction: boolean;
    polyfillInjection: boolean;
    modernSyntax: boolean;
  };

  // Error handling configuration
  errorHandling: {
    enhanced: boolean;
    suggestions: boolean;
    codeFrame: boolean;
    autoFix: boolean;
    formatters: {
      terminal: boolean;
      json: boolean;
      html: boolean;
    };
  };

  // Development experience
  devExperience: {
    fastRefresh: boolean;
    typeChecking: boolean;
    linting: boolean;
    formatting: boolean;
    progressBar: boolean;
    notifications: boolean;
    openBrowser: boolean;
  };

  // Performance optimization
  performance: {
    bundleAnalysis: boolean;
    compressionAnalysis: boolean;
    buildCache: boolean;
    parallelBuilds: boolean;
    incrementalBuilds: boolean;
    lazyCompilation: boolean;
  };

  // Experimental features
  experimental: {
    swcMinify?: boolean;
    rspack?: boolean;
    turbopack?: boolean;
    modulePreload?: boolean;
    cssLayers?: boolean;
    containerQueries?: boolean;
  };
}

/**
 * Configuration validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ConfigSuggestion[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: any;
  expected?: any;
}

export interface ValidationWarning {
  path: string;
  message: string;
  suggestion?: string;
}

export interface ConfigSuggestion {
  type: 'performance' | 'compatibility' | 'best-practice' | 'migration';
  message: string;
  action?: string;
  autoFixable?: boolean;
}

/**
 * Configuration migration information
 */
export interface MigrationInfo {
  fromVersion: string;
  toVersion: string;
  changes: ConfigChange[];
  breakingChanges: ConfigChange[];
  deprecations: ConfigDeprecation[];
}

export interface ConfigChange {
  type: 'added' | 'removed' | 'changed' | 'moved';
  path: string;
  oldPath?: string;
  description: string;
  migration?: string;
}

export interface ConfigDeprecation {
  path: string;
  message: string;
  replacement?: string;
  removeInVersion?: string;
}

/**
 * Default modern configuration
 */
export const defaultModernConfig: Partial<ModernBalmConfig> = {
  compiler: {
    type: 'swc', // Default to SWC for better performance
    options: {
      target: 'es2020',
      module: 'es6',
      jsx: 'react-jsx',
      sourceMap: true,
      minify: false,
    },
  },
  bundler: {
    type: 'vite', // Default to Vite for better DX
    options: {
      mode: 'development',
      sourceMap: true,
    },
  },
  target: {
    esVersion: 'es2020',
    features: {
      topLevelAwait: true,
      privateFields: true,
      staticBlocks: true,
      logicalAssignment: true,
      numericSeparators: true,
      optionalChaining: true,
      nullishCoalescing: true,
      dynamicImport: true,
      importMeta: true,
      bigint: true,
      decorators: false, // Experimental
    },
  },
  features: {
    hmr: true,
    splitting: true,
    treeshaking: true,
    minification: false, // Only in production
    sourceMap: true,
    cssExtraction: false, // Only in production
    polyfillInjection: true,
    modernSyntax: true,
  },
  errorHandling: {
    enhanced: true,
    suggestions: true,
    codeFrame: true,
    autoFix: false,
    formatters: {
      terminal: true,
      json: false,
      html: false,
    },
  },
  devExperience: {
    fastRefresh: true,
    typeChecking: true,
    linting: true,
    formatting: true,
    progressBar: true,
    notifications: true,
    openBrowser: false,
  },
  performance: {
    bundleAnalysis: false,
    compressionAnalysis: false,
    buildCache: true,
    parallelBuilds: true,
    incrementalBuilds: true,
    lazyCompilation: false,
  },
  experimental: {
    swcMinify: false,
    rspack: false,
    turbopack: false,
    modulePreload: true,
    cssLayers: false,
    containerQueries: false,
  },
};