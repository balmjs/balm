/**
 * SWC loader configuration for Webpack
 * Provides optimized JavaScript/TypeScript compilation using SWC
 */

import { RuleSetRule } from 'webpack';
import { ModernBalmConfig } from '../../../config/types.js';

/**
 * SWC loader options interface
 */
export interface SWCLoaderOptions {
  // Webpack-specific options
  cacheDirectory?: boolean | string;
  cacheCompression?: boolean;
  cacheIdentifier?: string;
  
  // SWC-specific webpack options
  sync?: boolean;
  parseMap?: boolean;
  
  // Custom options
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
  test?: string | RegExp | (string | RegExp)[];
  
  // SWC configuration
  jsc?: {
    target?: string;
    parser?: {
      syntax?: 'typescript' | 'ecmascript';
      tsx?: boolean;
      jsx?: boolean;
      decorators?: boolean;
      dynamicImport?: boolean;
    };
    transform?: {
      react?: {
        runtime?: 'automatic' | 'classic';
        development?: boolean;
        refresh?: boolean;
      };
      legacyDecorator?: boolean;
      decoratorMetadata?: boolean;
    };
  };
  minify?: boolean;
  sourceMaps?: boolean;
}

/**
 * SWC Webpack loader configuration generator
 */
export class SWCWebpackLoader {
  /**
   * Generate SWC loader rule for Webpack
   */
  static getLoaderRule(
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions> = {}
  ): RuleSetRule {
    // Merge with loader-specific options
    const loaderOptions: SWCLoaderOptions = {
      // Webpack-specific defaults
      cacheDirectory: true,
      cacheCompression: false,
      sync: false,
      parseMap: true,
      
      // SWC configuration
      jsc: {
        target: balmConfig.compiler?.target || 'es2020',
        parser: {
          syntax: this.detectSyntax(balmConfig),
          tsx: balmConfig.compiler?.jsx || false,
          jsx: balmConfig.compiler?.jsx || false,
          decorators: true,
          dynamicImport: true,
        },
        transform: {
          react: balmConfig.compiler?.jsx ? {
            runtime: 'automatic',
            development: balmConfig.mode === 'development',
            refresh: balmConfig.mode === 'development',
          } : undefined,
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
      minify: balmConfig.mode === 'production',
      sourceMaps: balmConfig.mode === 'development',
      ...options,
    };

    // Determine file patterns
    const extensions = this.getSupportedExtensions(balmConfig);
    const testPattern = this.buildTestPattern(extensions);
    
    return {
      test: options.test || testPattern,
      include: options.include || this.getDefaultIncludePaths(balmConfig),
      exclude: options.exclude || this.getDefaultExcludePaths(),
      use: {
        loader: this.getLoaderPath(),
        options: this.sanitizeOptions(loaderOptions),
      },
    };
  }

  /**
   * Generate multiple SWC loader rules for different file types
   */
  static getLoaderRules(
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions> = {}
  ): RuleSetRule[] {
    const rules: RuleSetRule[] = [];

    // JavaScript/JSX rule
    if (this.shouldProcessJavaScript(balmConfig)) {
      rules.push(this.getJavaScriptRule(balmConfig, options));
    }

    // TypeScript/TSX rule
    if (this.shouldProcessTypeScript(balmConfig)) {
      rules.push(this.getTypeScriptRule(balmConfig, options));
    }

    // Fallback to general rule if no specific rules
    if (rules.length === 0) {
      rules.push(this.getLoaderRule(balmConfig, options));
    }

    return rules;
  }

  /**
   * Generate development-optimized SWC loader rule
   */
  static getDevelopmentLoader(
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions> = {}
  ): RuleSetRule {
    const devOptions: Partial<SWCLoaderOptions> = {
      ...options,
      // Development optimizations
      cacheDirectory: true,
      cacheCompression: false,
      jsc: {
        ...options.jsc,
        transform: {
          ...options.jsc?.transform,
          react: options.jsc?.transform?.react ? {
            ...options.jsc.transform.react,
            development: true,
            refresh: true,
          } : undefined,
        },
      },
      minify: false,
      sourceMaps: true,
    };

    return this.getLoaderRule(balmConfig, devOptions);
  }

  /**
   * Generate production-optimized SWC loader rule
   */
  static getProductionLoader(
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions> = {}
  ): RuleSetRule {
    const prodOptions: Partial<SWCLoaderOptions> = {
      ...options,
      // Production optimizations
      cacheDirectory: true,
      cacheCompression: true,
      jsc: {
        ...options.jsc,
        transform: {
          ...options.jsc?.transform,
          react: options.jsc?.transform?.react ? {
            ...options.jsc.transform.react,
            development: false,
            refresh: false,
          } : undefined,
        },
      },
      minify: true,
      sourceMaps: false,
    };

    return this.getLoaderRule(balmConfig, prodOptions);
  }

  /**
   * Replace Babel loader with SWC loader in webpack config
   */
  static replaceBabelLoader(
    webpackConfig: any,
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions> = {}
  ): any {
    if (!webpackConfig.module?.rules) {
      return webpackConfig;
    }

    const swcRule = this.getLoaderRule(balmConfig, options);

    // Find and replace Babel loader rules
    webpackConfig.module.rules = webpackConfig.module.rules.map((rule: any) => {
      if (this.isBabelRule(rule)) {
        return {
          ...rule,
          ...swcRule,
        };
      }
      return rule;
    });

    return webpackConfig;
  }

  // Private helper methods

  private static getSupportedExtensions(balmConfig: Partial<ModernBalmConfig>): string[] {
    const baseExtensions = ['js', 'jsx'];
    
    if (balmConfig.compiler?.typescript) {
      baseExtensions.push('ts', 'tsx');
    }

    return baseExtensions;
  }

  private static buildTestPattern(extensions: string[]): RegExp {
    const escapedExtensions = extensions.map(ext => ext.replace('.', '\\.'));
    return new RegExp(`\\.(${escapedExtensions.join('|')})$`);
  }

  private static getDefaultIncludePaths(balmConfig: Partial<ModernBalmConfig>): (string | RegExp)[] {
    const paths: (string | RegExp)[] = [];

    // Add source paths if available
    if (balmConfig.paths?.src) {
      paths.push(balmConfig.paths.src);
    }
    
    // Add common source directories
    paths.push(/src/, /lib/, /app/);
    
    return paths;
  }

  private static getDefaultExcludePaths(): (string | RegExp)[] {
    return [
      /node_modules/,
      /bower_components/,
      /\.min\./,
    ];
  }

  private static shouldProcessJavaScript(balmConfig: Partial<ModernBalmConfig>): boolean {
    return true; // Always process JavaScript
  }

  private static shouldProcessTypeScript(balmConfig: Partial<ModernBalmConfig>): boolean {
    return Boolean(
      balmConfig.compiler?.typescript ||
      balmConfig.compiler?.primary === 'typescript'
    );
  }

  private static getJavaScriptRule(
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions>
  ): RuleSetRule {
    return this.getLoaderRule(balmConfig, {
      ...options,
      test: /\.(js|jsx)$/,
      jsc: {
        ...options.jsc,
        parser: {
          ...options.jsc?.parser,
          syntax: 'ecmascript',
          jsx: true,
        },
      },
    });
  }

  private static getTypeScriptRule(
    balmConfig: Partial<ModernBalmConfig>,
    options: Partial<SWCLoaderOptions>
  ): RuleSetRule {
    return this.getLoaderRule(balmConfig, {
      ...options,
      test: /\.(ts|tsx)$/,
      jsc: {
        ...options.jsc,
        parser: {
          ...options.jsc?.parser,
          syntax: 'typescript',
          tsx: true,
        },
      },
    });
  }

  private static getLoaderPath(): string {
    try {
      return require.resolve('swc-loader');
    } catch {
      // Fallback to package name
      return 'swc-loader';
    }
  }

  private static sanitizeOptions(options: SWCLoaderOptions): any {
    // Remove webpack-specific options from SWC options
    const {
      include,
      exclude,
      test,
      cacheDirectory,
      cacheCompression,
      cacheIdentifier,
      sync,
      parseMap,
      ...swcOptions
    } = options;

    return {
      // Webpack loader options
      ...(cacheDirectory !== undefined && { cacheDirectory }),
      ...(cacheCompression !== undefined && { cacheCompression }),
      ...(cacheIdentifier !== undefined && { cacheIdentifier }),
      ...(sync !== undefined && { sync }),
      ...(parseMap !== undefined && { parseMap }),
      
      // SWC options
      ...swcOptions,
    };
  }

  private static detectSyntax(balmConfig: Partial<ModernBalmConfig>): 'typescript' | 'ecmascript' {
    return balmConfig.compiler?.typescript ? 'typescript' : 'ecmascript';
  }

  private static isBabelRule(rule: any): boolean {
    if (!rule.use) return false;

    const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
    
    return uses.some((use: any) => {
      const loader = typeof use === 'string' ? use : use.loader;
      return loader && (
        loader.includes('babel-loader') ||
        loader.includes('babel')
      );
    });
  }
}

/**
 * Helper function to create SWC loader rule
 */
export function createSWCLoader(
  balmConfig: Partial<ModernBalmConfig>,
  options: Partial<SWCLoaderOptions> = {}
): RuleSetRule {
  return SWCWebpackLoader.getLoaderRule(balmConfig, options);
}

/**
 * Helper function to create development SWC loader
 */
export function createSWCDevLoader(
  balmConfig: Partial<ModernBalmConfig>,
  options: Partial<SWCLoaderOptions> = {}
): RuleSetRule {
  return SWCWebpackLoader.getDevelopmentLoader(balmConfig, options);
}

/**
 * Helper function to create production SWC loader
 */
export function createSWCProdLoader(
  balmConfig: Partial<ModernBalmConfig>,
  options: Partial<SWCLoaderOptions> = {}
): RuleSetRule {
  return SWCWebpackLoader.getProductionLoader(balmConfig, options);
}