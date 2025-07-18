/**
 * SWC configuration system
 * Provides configuration mapping, validation, and presets for SWC compiler
 */

import { CompilerOptions } from '../base.js';
import { SWCOptions } from './index.js';
import { ModernBalmConfig } from '../../config/modern.js';

/**
 * SWC configuration mapper
 * Converts BalmJS configuration to SWC-specific options
 */
export class SWCConfigMapper {
  /**
   * Map BalmJS compiler options to SWC options
   */
  static mapBalmConfigToSWC(
    balmConfig: Partial<ModernBalmConfig>,
    compilerOptions: CompilerOptions
  ): SWCOptions {
    const swcConfig = balmConfig.compiler?.swc || {};
    const targetConfig = balmConfig.target;
    const featuresConfig = balmConfig.features;

    // Determine syntax based on file extensions and configuration
    const isTypeScript = this.shouldUseTypeScript(balmConfig);
    const hasJSX = this.shouldEnableJSX(balmConfig);
    const hasReact = this.shouldEnableReact(balmConfig);

    const baseConfig: SWCOptions = {
      jsc: {
        parser: {
          syntax: isTypeScript ? 'typescript' : 'ecmascript',
          tsx: isTypeScript && hasJSX,
          jsx: !isTypeScript && hasJSX,
          decorators: this.shouldEnableDecorators(balmConfig, compilerOptions),
          dynamicImport: targetConfig?.features?.dynamicImport !== false,
          privateMethod: targetConfig?.features?.privateFields !== false,
          functionBind: false,
          exportDefaultFrom: true,
          exportNamespaceFrom: true,
          decoratorsBeforeExport: true,
          topLevelAwait: targetConfig?.features?.topLevelAwait !== false,
          importMeta: targetConfig?.features?.importMeta !== false,
        },
        target: this.mapESTarget(targetConfig?.esVersion || compilerOptions.target || 'es2020'),
        loose: false,
        externalHelpers: false,
        keepClassNames: compilerOptions.minify ? false : true,
        transform: {
          react: hasReact ? this.buildReactConfig(balmConfig, compilerOptions) : undefined,
          optimizer: this.buildOptimizerConfig(balmConfig, compilerOptions),
          decoratorMetadata: compilerOptions.emitDecoratorMetadata || false,
          legacyDecorator: compilerOptions.experimentalDecorators || false,
          decoratorVersion: '2022-03',
          useDefineForClassFields: true,
        },
        experimental: {
          plugins: swcConfig.jsc?.experimental?.plugins || [],
        },
        baseUrl: swcConfig.jsc?.baseUrl,
        paths: swcConfig.jsc?.paths,
      },
      module: {
        type: this.mapModuleType(compilerOptions.module || 'es6'),
        strict: compilerOptions.strict !== false,
        strictMode: true,
        lazy: false,
        noInterop: false,
        ignoreDynamic: false,
      },
      minify: this.buildMinifyConfig(balmConfig, compilerOptions),
      sourceMaps: featuresConfig?.sourceMap !== false,
      inlineSourcesContent: true,
      env: this.buildEnvConfig(balmConfig),
    };

    // Merge with user-provided SWC config
    return this.deepMerge(baseConfig, swcConfig);
  }

  /**
   * Create SWC configuration for specific project types
   */
  static createProjectConfig(
    projectType: 'react' | 'vue' | 'angular' | 'svelte' | 'library' | 'node',
    options: Partial<SWCOptions> = {}
  ): SWCOptions {
    const baseConfigs: Record<string, Partial<SWCOptions>> = {
      react: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            jsx: true,
            decorators: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
              development: process.env.NODE_ENV !== 'production',
              refresh: process.env.NODE_ENV === 'development',
            },
          },
        },
      },
      vue: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            jsx: false,
            decorators: true,
          },
          transform: {
            decoratorMetadata: true,
          },
        },
      },
      angular: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            jsx: false,
            decorators: true,
          },
          transform: {
            decoratorMetadata: true,
            legacyDecorator: false,
            decoratorVersion: '2022-03',
          },
        },
      },
      svelte: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            jsx: false,
          },
        },
      },
      library: {
        jsc: {
          target: 'es2018',
          externalHelpers: true,
        },
        module: {
          type: 'es6',
        },
        minify: false,
      },
      node: {
        jsc: {
          target: 'es2020',
        },
        module: {
          type: 'commonjs',
        },
      },
    };

    const baseConfig = baseConfigs[projectType] || {};
    return this.deepMerge(this.getDefaultConfig(), baseConfig, options);
  }

  /**
   * Get default SWC configuration
   */
  static getDefaultConfig(): SWCOptions {
    return {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: false,
          tsx: false,
          decorators: false,
          dynamicImport: true,
          privateMethod: true,
          functionBind: false,
          exportDefaultFrom: true,
          exportNamespaceFrom: true,
          decoratorsBeforeExport: true,
          topLevelAwait: true,
          importMeta: true,
        },
        target: 'es2020',
        loose: false,
        externalHelpers: false,
        keepClassNames: false,
        transform: {
          optimizer: {
            globals: {
              vars: {
                'process.env.NODE_ENV': '"development"',
              },
            },
          },
          useDefineForClassFields: true,
        },
      },
      module: {
        type: 'es6',
        strict: true,
        strictMode: true,
        lazy: false,
        noInterop: false,
      },
      minify: false,
      sourceMaps: true,
      inlineSourcesContent: true,
    };
  }

  /**
   * Validate SWC configuration
   */
  static validateConfig(config: SWCOptions): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate parser syntax
    if (config.jsc?.parser?.syntax && !['typescript', 'ecmascript'].includes(config.jsc.parser.syntax)) {
      errors.push(`Invalid parser syntax: ${config.jsc.parser.syntax}. Must be 'typescript' or 'ecmascript'`);
    }

    // Validate target
    const validTargets = ['es3', 'es5', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'esnext'];
    if (config.jsc?.target && !validTargets.includes(config.jsc.target)) {
      errors.push(`Invalid target: ${config.jsc.target}. Must be one of: ${validTargets.join(', ')}`);
    }

    // Validate module type
    const validModuleTypes = ['commonjs', 'umd', 'amd', 'es6'];
    if (config.module?.type && !validModuleTypes.includes(config.module.type)) {
      errors.push(`Invalid module type: ${config.module.type}. Must be one of: ${validModuleTypes.join(', ')}`);
    }

    // Check for potential issues
    if (config.jsc?.parser?.syntax === 'typescript' && !config.jsc.parser.tsx && !config.jsc.parser.jsx) {
      warnings.push('TypeScript syntax enabled but JSX/TSX disabled. Consider enabling TSX for React projects');
    }

    if (config.jsc?.target === 'es5' && config.jsc.parser?.decorators) {
      warnings.push('ES5 target with decorators may have compatibility issues');
    }

    if (config.minify && typeof config.minify === 'object' && config.minify.compress && config.minify.compress.drop_console) {
      warnings.push('Console statements will be removed in production builds');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate optimized configuration for production
   */
  static createProductionConfig(baseConfig: SWCOptions): SWCOptions {
    return this.deepMerge(baseConfig, {
      jsc: {
        transform: {
          optimizer: {
            globals: {
              vars: {
                'process.env.NODE_ENV': '"production"',
                __DEBUG__: 'false',
                __DEV__: 'false',
              },
            },
          },
        },
      },
      minify: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          dead_code: true,
          unused: true,
          collapse_vars: true,
          reduce_vars: true,
        },
        mangle: {
          topLevel: false,
          keepClassNames: false,
          keepFnNames: false,
          safari10: true,
        },
        format: {
          comments: false,
          asciiOnly: true,
        },
      },
      sourceMaps: false,
    });
  }

  /**
   * Generate development-optimized configuration
   */
  static createDevelopmentConfig(baseConfig: SWCOptions): SWCOptions {
    return this.deepMerge(baseConfig, {
      jsc: {
        transform: {
          react: baseConfig.jsc?.transform?.react ? {
            ...baseConfig.jsc.transform.react,
            development: true,
            refresh: true,
          } : undefined,
          optimizer: {
            globals: {
              vars: {
                'process.env.NODE_ENV': '"development"',
                __DEBUG__: 'true',
                __DEV__: 'true',
              },
            },
          },
        },
      },
      minify: false,
      sourceMaps: true,
    });
  }

  // Private helper methods

  private static shouldUseTypeScript(config: Partial<ModernBalmConfig>): boolean {
    // Check if TypeScript is explicitly configured
    if (config.compiler?.swc?.jsc?.parser?.syntax === 'typescript') {
      return true;
    }

    // Check for TypeScript-related features
    if (config.devExperience?.typeChecking !== false) {
      return true;
    }

    return false;
  }

  private static shouldEnableJSX(config: Partial<ModernBalmConfig>): boolean {
    // Check for React or JSX configuration
    if (config.compiler?.swc?.jsc?.transform?.react) {
      return true;
    }

    // Check for JSX in compiler options
    const jsx = config.compiler?.options?.jsx;
    return jsx !== undefined && jsx !== 'preserve';
  }

  private static shouldEnableReact(config: Partial<ModernBalmConfig>): boolean {
    return this.shouldEnableJSX(config);
  }

  private static shouldEnableDecorators(
    config: Partial<ModernBalmConfig>,
    compilerOptions: CompilerOptions
  ): boolean {
    return (
      compilerOptions.experimentalDecorators ||
      config.target?.features?.decorators ||
      config.compiler?.swc?.jsc?.parser?.decorators ||
      false
    );
  }

  private static mapESTarget(target: string): SWCOptions['jsc']['target'] {
    const targetMap: Record<string, SWCOptions['jsc']['target']> = {
      'es3': 'es3',
      'es5': 'es5',
      'es2015': 'es2015',
      'es2016': 'es2016',
      'es2017': 'es2017',
      'es2018': 'es2018',
      'es2019': 'es2019',
      'es2020': 'es2020',
      'es2021': 'es2021',
      'es2022': 'es2022',
      'esnext': 'esnext',
    };

    return targetMap[target] || 'es2020';
  }

  private static mapModuleType(module: string): SWCOptions['module']['type'] {
    const moduleMap: Record<string, SWCOptions['module']['type']> = {
      'commonjs': 'commonjs',
      'amd': 'amd',
      'umd': 'umd',
      'es6': 'es6',
      'es2015': 'es6',
      'es2020': 'es6',
      'esnext': 'es6',
    };

    return moduleMap[module] || 'es6';
  }

  private static buildReactConfig(
    config: Partial<ModernBalmConfig>,
    compilerOptions: CompilerOptions
  ): SWCOptions['jsc']['transform']['react'] {
    const reactConfig = config.compiler?.swc?.jsc?.transform?.react;
    const isDevelopment = !compilerOptions.minify;

    return {
      runtime: compilerOptions.jsx === 'react-jsx' ? 'automatic' : 'classic',
      development: isDevelopment,
      refresh: isDevelopment && config.features?.hmr !== false,
      importSource: reactConfig?.importSource,
      pragma: reactConfig?.pragma,
      pragmaFrag: reactConfig?.pragmaFrag,
      throwIfNamespace: reactConfig?.throwIfNamespace,
      useBuiltins: reactConfig?.useBuiltins,
    };
  }

  private static buildOptimizerConfig(
    config: Partial<ModernBalmConfig>,
    compilerOptions: CompilerOptions
  ): SWCOptions['jsc']['transform']['optimizer'] {
    const isProduction = compilerOptions.minify;
    const nodeEnv = isProduction ? 'production' : 'development';

    return {
      globals: {
        vars: {
          'process.env.NODE_ENV': `"${nodeEnv}"`,
          __DEBUG__: isProduction ? 'false' : 'true',
          __DEV__: isProduction ? 'false' : 'true',
          ...config.compiler?.swc?.jsc?.transform?.optimizer?.globals?.vars,
        },
        typeofs: config.compiler?.swc?.jsc?.transform?.optimizer?.globals?.typeofs,
      },
      jsonify: config.compiler?.swc?.jsc?.transform?.optimizer?.jsonify,
    };
  }

  private static buildMinifyConfig(
    config: Partial<ModernBalmConfig>,
    compilerOptions: CompilerOptions
  ): SWCOptions['minify'] {
    if (!compilerOptions.minify) {
      return false;
    }

    const userMinifyConfig = config.compiler?.swc?.minify;
    if (typeof userMinifyConfig === 'object') {
      return userMinifyConfig;
    }

    return {
      compress: {
        arguments: false,
        arrows: true,
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        computed_props: true,
        conditionals: true,
        dead_code: true,
        directives: true,
        drop_console: true,
        drop_debugger: true,
        evaluate: true,
        hoist_props: true,
        if_return: true,
        join_vars: true,
        keep_fargs: true,
        loops: true,
        negate_iife: true,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        typeofs: true,
        unused: true,
      },
      mangle: {
        topLevel: false,
        keepClassNames: false,
        keepFnNames: false,
        safari10: true,
      },
      format: {
        comments: false,
        asciiOnly: true,
        quoteMark: 'auto',
        semicolons: true,
      },
    };
  }

  private static buildEnvConfig(config: Partial<ModernBalmConfig>): SWCOptions['env'] {
    const browserslist = config.target?.browsers;
    if (!browserslist) {
      return undefined;
    }

    return {
      targets: Array.isArray(browserslist) ? browserslist : [browserslist],
      mode: 'usage',
      coreJs: '3',
      shippedProposals: true,
    };
  }

  private static deepMerge<T>(...objects: Partial<T>[]): T {
    const result = {} as T;

    for (const obj of objects) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = this.deepMerge(result[key] || {}, value);
          } else {
            result[key] = value as T[Extract<keyof T, string>];
          }
        }
      }
    }

    return result;
  }
}

/**
 * SWC configuration presets for common use cases
 */
export const SWCPresets = {
  /**
   * React application preset
   */
  react: SWCConfigMapper.createProjectConfig('react'),

  /**
   * Vue application preset
   */
  vue: SWCConfigMapper.createProjectConfig('vue'),

  /**
   * Angular application preset
   */
  angular: SWCConfigMapper.createProjectConfig('angular'),

  /**
   * Svelte application preset
   */
  svelte: SWCConfigMapper.createProjectConfig('svelte'),

  /**
   * Library preset
   */
  library: SWCConfigMapper.createProjectConfig('library'),

  /**
   * Node.js application preset
   */
  node: SWCConfigMapper.createProjectConfig('node'),

  /**
   * Modern web application preset (ES2022+)
   */
  modern: SWCConfigMapper.createProjectConfig('react', {
    jsc: {
      target: 'es2022',
      parser: {
        topLevelAwait: true,
        privateMethod: true,
        decorators: true,
      },
    },
  }),

  /**
   * Legacy browser support preset (ES5)
   */
  legacy: SWCConfigMapper.createProjectConfig('react', {
    jsc: {
      target: 'es5',
      loose: true,
    },
    env: {
      targets: 'ie 11',
      mode: 'usage',
      coreJs: '3',
    },
  }),
};