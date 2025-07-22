/**
 * Babel compiler implementation
 * Adapts existing Babel functionality to the new compiler interface
 */

import fs from 'node:fs';
import { BaseCompiler, CompilerOptions, TransformResult, MinifyResult, CompilerConfig } from '../base.js';

export class BabelCompiler extends BaseCompiler {
  private babel: any;
  private babelCore: any;

  constructor(options: CompilerOptions = {}) {
    super(options);
    this.initializeBabel();
  }

  private initializeBabel(): void {
    try {
      this.babelCore = require('@babel/core');
      this.babel = this.babelCore;
    } catch (error) {
      throw new Error('Babel is not installed. Please install @babel/core');
    }
  }

  async transform(code: string, filename: string): Promise<TransformResult> {
    try {
      const result = await this.babel.transformAsync(code, {
        filename,
        ...this.getBabelOptions(),
      });

      return {
        code: result.code || '',
        map: result.map ? JSON.stringify(result.map) : undefined,
      };
    } catch (error) {
      throw new Error(`Babel transform failed: ${(error as Error).message}`);
    }
  }

  async transformFile(filename: string): Promise<TransformResult> {
    try {
      const code = fs.readFileSync(filename, 'utf-8');
      return await this.transform(code, filename);
    } catch (error) {
      throw new Error(`Failed to transform file ${filename}: ${(error as Error).message}`);
    }
  }

  async minify(code: string, filename?: string): Promise<MinifyResult> {
    if (!this.options.minify) {
      return { code };
    }

    try {
      const result = await this.babel.transformAsync(code, {
        filename,
        ...this.getBabelOptions(),
        minified: true,
        comments: false,
      });

      return {
        code: result.code || '',
        map: result.map ? JSON.stringify(result.map) : undefined,
      };
    } catch (error) {
      throw new Error(`Babel minify failed: ${(error as Error).message}`);
    }
  }

  getConfig(): CompilerConfig {
    return {
      name: 'babel',
      version: this.getBabelVersion(),
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

  private getBabelOptions(): any {
    const presets = [];
    const plugins = [];

    // Add TypeScript preset if needed
    if (this.options.target && this.options.target !== 'es5') {
      presets.push([
        '@babel/preset-env',
        {
          targets: this.getTargets(),
          modules: this.options.module === 'es6' ? false : this.options.module,
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ]);
    }

    // Add TypeScript preset for .ts/.tsx files
    presets.push('@babel/preset-typescript');

    // Add React preset for JSX
    if (this.options.jsx) {
      presets.push([
        '@babel/preset-react',
        {
          runtime: this.options.jsx === 'react-jsx' ? 'automatic' : 'classic',
        },
      ]);
    }

    // Add decorator support
    if (this.options.experimentalDecorators) {
      plugins.push(['@babel/plugin-proposal-decorators', { legacy: true }]);
    }

    return {
      presets,
      plugins,
      sourceMaps: this.options.sourceMap,
      compact: this.options.minify,
    };
  }

  private getTargets(): string | object {
    switch (this.options.target) {
      case 'es5':
        return 'ie 11';
      case 'es2015':
        return 'chrome 51, firefox 54, safari 10';
      case 'es2020':
        return 'chrome 80, firefox 72, safari 13.1';
      case 'es2022':
        return 'chrome 94, firefox 93, safari 15';
      case 'esnext':
        return 'last 1 chrome version, last 1 firefox version, last 1 safari version';
      default:
        return 'defaults';
    }
  }

  private getBabelVersion(): string {
    try {
      return this.babelCore.version || '7.x.x';
    } catch {
      return 'unknown';
    }
  }
}