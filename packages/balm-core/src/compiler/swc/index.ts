/**
 * SWC compiler implementation
 * Provides high-performance JavaScript/TypeScript compilation using SWC
 */

import fs from 'node:fs';
import { BaseCompiler, CompilerOptions, TransformResult, MinifyResult, CompilerConfig } from '../base.js';

/**
 * SWC-specific configuration interface
 */
export interface SWCOptions {
  jsc?: {
    parser?: {
      syntax: 'typescript' | 'ecmascript';
      tsx?: boolean;
      jsx?: boolean;
      decorators?: boolean;
      dynamicImport?: boolean;
      privateMethod?: boolean;
      functionBind?: boolean;
      exportDefaultFrom?: boolean;
      exportNamespaceFrom?: boolean;
      decoratorsBeforeExport?: boolean;
      topLevelAwait?: boolean;
      importMeta?: boolean;
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
      decoratorVersion?: '2021-12' | '2022-03';
      useDefineForClassFields?: boolean;
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
    };
    experimental?: {
      plugins?: Array<[string, any]>;
      cacheRoot?: string;
    };
    baseUrl?: string;
    paths?: Record<string, string[]>;
  };
  module?: {
    type?: 'commonjs' | 'umd' | 'amd' | 'es6';
    strict?: boolean;
    strictMode?: boolean;
    lazy?: boolean;
    noInterop?: boolean;
    ignoreDynamic?: boolean;
  };
  minify?: boolean | {
    compress?: boolean | {
      arguments?: boolean;
      arrows?: boolean;
      booleans?: boolean;
      booleans_as_integers?: boolean;
      collapse_vars?: boolean;
      comparisons?: boolean;
      computed_props?: boolean;
      conditionals?: boolean;
      dead_code?: boolean;
      directives?: boolean;
      drop_console?: boolean;
      drop_debugger?: boolean;
      evaluate?: boolean;
      expression?: boolean;
      hoist_funs?: boolean;
      hoist_props?: boolean;
      hoist_vars?: boolean;
      if_return?: boolean;
      join_vars?: boolean;
      keep_classnames?: boolean;
      keep_fargs?: boolean;
      keep_fnames?: boolean;
      keep_infinity?: boolean;
      loops?: boolean;
      negate_iife?: boolean;
      properties?: boolean;
      reduce_funcs?: boolean;
      reduce_vars?: boolean;
      side_effects?: boolean;
      switches?: boolean;
      typeofs?: boolean;
      unsafe?: boolean;
      unsafe_arrows?: boolean;
      unsafe_comps?: boolean;
      unsafe_Function?: boolean;
      unsafe_math?: boolean;
      unsafe_symbols?: boolean;
      unsafe_methods?: boolean;
      unsafe_proto?: boolean;
      unsafe_regexp?: boolean;
      unsafe_undefined?: boolean;
      unused?: boolean;
    };
    mangle?: boolean | {
      props?: {
        reserved?: string[];
        undeclared?: boolean;
        regex?: string;
      };
      topLevel?: boolean;
      keepClassNames?: boolean;
      keepFnNames?: boolean;
      keepPrivateProps?: boolean;
      ie8?: boolean;
      safari10?: boolean;
    };
    format?: {
      comments?: boolean | 'all' | 'some';
      asciiOnly?: boolean;
      beautify?: boolean;
      braces?: boolean;
      ecma?: number;
      indentLevel?: number;
      indentStart?: number;
      inlineScript?: boolean;
      keepNumbers?: boolean;
      maxLineLen?: number;
      preamble?: string;
      preserveAnnotations?: boolean;
      quoteMark?: 'auto' | 'single' | 'double';
      semicolons?: boolean;
      shebang?: boolean;
      webkit?: boolean;
      wrapIife?: boolean;
      wrapFuncArgs?: boolean;
    };
    ecma?: 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
    keepClassnames?: boolean;
    keepFnames?: boolean;
    safari10?: boolean;
    toplevel?: boolean;
  };
  sourceMaps?: boolean | 'inline';
  inlineSourcesContent?: boolean;
  inputSourceMap?: string | object;
  filename?: string;
  configFile?: boolean | string;
  swcrc?: boolean;
  env?: {
    targets?: string | string[] | Record<string, string>;
    mode?: 'usage' | 'entry';
    coreJs?: string;
    shippedProposals?: boolean;
    include?: string[];
    exclude?: string[];
    forceAllTransforms?: boolean;
    configPath?: string;
    ignoreBrowserslistConfig?: boolean;
    browserslistEnv?: string;
  };
}

export class SWCCompiler extends BaseCompiler {
  private swc: any;
  private swcOptions: SWCOptions;

  constructor(options: CompilerOptions = {}) {
    super(options);
    this.initializeSWC();
    this.swcOptions = this.buildSWCOptions();
  }

  private initializeSWC(): void {
    try {
      this.swc = require('@swc/core');
    } catch (error) {
      throw new Error(
        'SWC is not installed. Please install @swc/core: npm install @swc/core'
      );
    }
  }

  async transform(code: string, filename: string): Promise<TransformResult> {
    try {
      const options = {
        ...this.swcOptions,
        filename,
        sourceMaps: this.options.sourceMap,
      };

      const result = await this.swc.transform(code, options);

      return {
        code: result.code,
        map: result.map ? JSON.stringify(result.map) : undefined,
      };
    } catch (error) {
      throw new Error(`SWC transform failed for ${filename}: ${error.message}`);
    }
  }

  async transformFile(filename: string): Promise<TransformResult> {
    try {
      const code = fs.readFileSync(filename, 'utf-8');
      return await this.transform(code, filename);
    } catch (error) {
      throw new Error(`Failed to transform file ${filename}: ${error.message}`);
    }
  }

  async minify(code: string, filename?: string): Promise<MinifyResult> {
    if (!this.options.minify) {
      return { code };
    }

    try {
      const options = {
        ...this.swcOptions,
        filename,
        minify: true,
        sourceMaps: this.options.sourceMap,
      };

      const result = await this.swc.minify(code, options);

      return {
        code: result.code,
        map: result.map ? JSON.stringify(result.map) : undefined,
      };
    } catch (error) {
      throw new Error(`SWC minify failed: ${error.message}`);
    }
  }

  getConfig(): CompilerConfig {
    return {
      name: 'swc',
      version: this.getSWCVersion(),
      options: this.options,
      extensions: this.getSupportedExtensions(),
    };
  }

  supportsExtension(extension: string): boolean {
    const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
    return supportedExtensions.includes(extension.startsWith('.') ? extension : `.${extension}`);
  }

  getSupportedExtensions(): string[] {
    return ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
  }

  /**
   * Get SWC-specific options
   */
  getSWCOptions(): SWCOptions {
    return { ...this.swcOptions };
  }

  /**
   * Update SWC-specific options
   */
  updateSWCOptions(options: Partial<SWCOptions>): void {
    this.swcOptions = { ...this.swcOptions, ...options };
  }

  /**
   * Build SWC configuration from compiler options
   */
  private buildSWCOptions(): SWCOptions {
    const isTypeScript = this.options.jsx?.includes('tsx') || false;
    const isJSX = this.options.jsx !== 'preserve';

    return {
      jsc: {
        parser: {
          syntax: isTypeScript ? 'typescript' : 'ecmascript',
          tsx: isTypeScript && isJSX,
          jsx: !isTypeScript && isJSX,
          decorators: this.options.experimentalDecorators || false,
          dynamicImport: true,
          privateMethod: true,
          functionBind: false,
          exportDefaultFrom: true,
          exportNamespaceFrom: true,
          decoratorsBeforeExport: true,
          topLevelAwait: true,
          importMeta: true,
        },
        target: this.mapTarget(this.options.target || 'es2020'),
        loose: false,
        externalHelpers: false,
        keepClassNames: false,
        transform: {
          react: isJSX ? {
            runtime: this.options.jsx === 'react-jsx' ? 'automatic' : 'classic',
            development: !this.options.minify,
            refresh: !this.options.minify, // Enable Fast Refresh in development
          } : undefined,
          optimizer: this.options.minify ? {
            globals: {
              vars: {
                __DEBUG__: 'false',
                'process.env.NODE_ENV': this.options.minify ? '"production"' : '"development"',
              },
            },
          } : undefined,
          decoratorMetadata: this.options.emitDecoratorMetadata || false,
          legacyDecorator: this.options.experimentalDecorators || false,
          useDefineForClassFields: true,
        },
      },
      module: {
        type: this.mapModule(this.options.module || 'es6'),
        strict: this.options.strict !== false,
        strictMode: true,
        lazy: false,
        noInterop: false,
      },
      minify: this.options.minify ? {
        compress: {
          arguments: false,
          arrows: true,
          booleans: true,
          booleans_as_integers: false,
          collapse_vars: true,
          comparisons: true,
          computed_props: true,
          conditionals: true,
          dead_code: true,
          directives: true,
          drop_console: this.options.minify,
          drop_debugger: this.options.minify,
          evaluate: true,
          expression: false,
          hoist_funs: false,
          hoist_props: true,
          hoist_vars: false,
          if_return: true,
          join_vars: true,
          keep_classnames: false,
          keep_fargs: true,
          keep_fnames: false,
          keep_infinity: false,
          loops: true,
          negate_iife: true,
          properties: true,
          reduce_funcs: true,
          reduce_vars: true,
          side_effects: true,
          switches: true,
          typeofs: true,
          unsafe: false,
          unsafe_arrows: false,
          unsafe_comps: false,
          unsafe_Function: false,
          unsafe_math: false,
          unsafe_symbols: false,
          unsafe_methods: false,
          unsafe_proto: false,
          unsafe_regexp: false,
          unsafe_undefined: false,
          unused: true,
        },
        mangle: {
          topLevel: false,
          keepClassNames: false,
          keepFnNames: false,
          keepPrivateProps: false,
          ie8: false,
          safari10: true,
        },
        format: {
          comments: false,
          asciiOnly: true,
          beautify: false,
          braces: false,
          ecma: this.getECMAVersion(),
          preserveAnnotations: false,
          quoteMark: 'auto',
          semicolons: true,
          shebang: true,
          webkit: false,
        },
        ecma: this.getECMAVersion(),
        keepClassnames: false,
        keepFnames: false,
        safari10: true,
        toplevel: false,
      } : false,
      sourceMaps: this.options.sourceMap,
      inlineSourcesContent: true,
    };
  }

  /**
   * Map compiler target to SWC target
   */
  private mapTarget(target: string): SWCOptions['jsc']['target'] {
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

  /**
   * Map compiler module to SWC module
   */
  private mapModule(module: string): SWCOptions['module']['type'] {
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

  /**
   * Get ECMA version number for minification
   */
  private getECMAVersion(): 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 {
    const target = this.options.target || 'es2020';
    const versionMap: Record<string, 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020> = {
      'es5': 5,
      'es2015': 2015,
      'es2016': 2016,
      'es2017': 2017,
      'es2018': 2018,
      'es2019': 2019,
      'es2020': 2020,
      'es2021': 2020, // Use 2020 as max supported
      'es2022': 2020,
      'esnext': 2020,
    };

    return versionMap[target] || 2020;
  }

  /**
   * Get SWC version
   */
  private getSWCVersion(): string {
    try {
      const pkg = require('@swc/core/package.json');
      return pkg.version;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Parse SWC configuration from file
   */
  static async parseConfigFile(configPath: string): Promise<SWCOptions> {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse SWC config file ${configPath}: ${error.message}`);
    }
  }

  /**
   * Create optimized SWC options for different scenarios
   */
  static createPreset(preset: 'react' | 'vue' | 'library' | 'node'): Partial<SWCOptions> {
    const presets: Record<string, Partial<SWCOptions>> = {
      react: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
              development: false,
              refresh: true,
            },
          },
        },
      },
      vue: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
          },
        },
      },
      library: {
        jsc: {
          target: 'es2018',
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

    return presets[preset] || {};
  }
}