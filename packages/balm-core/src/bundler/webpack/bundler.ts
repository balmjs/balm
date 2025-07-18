/**
 * Webpack bundler implementation
 * Adapts existing Webpack functionality to the new bundler interface
 */

import { webpack, webpackConfig } from './index.js';
import { BaseBundler, BundlerOptions, BuildResult, DevServer, BundlerConfig, Asset, Chunk, BundlerError, BuildStats } from '../base.js';
import { Configuration } from '@balm-core/index';

export class WebpackBundler extends BaseBundler {
  private compiler: any;
  private webpackDevServer: any;

  constructor(options: BundlerOptions = {}) {
    super(options);
  }

  async build(): Promise<BuildResult> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      try {
        const config = this.getWebpackConfig();
        this.compiler = webpack(config);

        this.compiler.run((error: any, stats: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          if (error) {
            resolve({
              success: false,
              outputPath: this.options.output?.path || 'dist',
              assets: [],
              chunks: [],
              errors: [this.createBundlerError(error)],
              warnings: [],
              stats: {
                startTime,
                endTime,
                duration,
                bundleSize: 0,
                chunkCount: 0,
                assetCount: 0,
              },
            });
            return;
          }

          const info = stats.toJson();
          const hasErrors = stats.hasErrors();
          const hasWarnings = stats.hasWarnings();

          resolve({
            success: !hasErrors,
            outputPath: this.options.output?.path || 'dist',
            assets: this.extractAssets(info),
            chunks: this.extractChunks(info),
            errors: hasErrors ? info.errors?.map((err: any) => this.createBundlerError(err)) || [] : [],
            warnings: hasWarnings ? info.warnings?.map((warn: any) => this.createBundlerWarning(warn)) || [] : [],
            stats: {
              startTime,
              endTime,
              duration,
              bundleSize: this.calculateBundleSize(info),
              chunkCount: info.chunks?.length || 0,
              assetCount: info.assets?.length || 0,
            },
          });
        });
      } catch (error) {
        reject(new Error(`Webpack build failed: ${error.message}`));
      }
    });
  }

  async serve(): Promise<DevServer> {
    const config = this.getWebpackConfig();
    this.compiler = webpack(config);

    const devServerOptions = {
      port: this.options.devServer?.port || 3000,
      host: this.options.devServer?.host || 'localhost',
      hot: this.options.devServer?.hot !== false,
      open: this.options.devServer?.open || false,
    };

    const devServer: DevServer = {
      start: async () => {
        return new Promise((resolve, reject) => {
          try {
            const WebpackDevServer = require('webpack-dev-server');
            this.webpackDevServer = new WebpackDevServer(devServerOptions, this.compiler);
            
            this.webpackDevServer.startCallback((error: any) => {
              if (error) {
                reject(new Error(`Failed to start dev server: ${error.message}`));
                return;
              }
              resolve();
            });
          } catch (error) {
            reject(new Error(`Failed to start Webpack dev server: ${error.message}`));
          }
        });
      },

      stop: async () => {
        if (this.webpackDevServer) {
          if (typeof this.webpackDevServer.stop === 'function') {
            await this.webpackDevServer.stop();
          } else if (typeof this.webpackDevServer.close === 'function') {
            await new Promise<void>((resolve) => {
              this.webpackDevServer.close(() => resolve());
            });
          }
          this.webpackDevServer = null;
        }
      },

      reload: async () => {
        if (this.webpackDevServer && this.webpackDevServer.sockWrite) {
          this.webpackDevServer.sockWrite(this.webpackDevServer.sockets, 'content-changed');
        }
      },

      getUrl: () => {
        const { port, host } = devServerOptions;
        return `http://${host}:${port}`;
      },

      isRunning: () => {
        return !!this.webpackDevServer;
      }
    };

    this.devServer = devServer;
    return devServer;
  }

  async watch(callback?: (result: BuildResult) => void): Promise<void> {
    const config = this.getWebpackConfig();
    this.compiler = webpack(config);

    this.compiler.watch({
      aggregateTimeout: 300,
      poll: undefined,
    }, async (error: any, stats: any) => {
      const result = await this.processCompilerResult(error, stats);
      if (callback) {
        callback(result);
      }
    });
  }

  getConfig(): BundlerConfig {
    return {
      name: 'webpack',
      version: this.getWebpackVersion(),
      options: this.options,
      supportedFeatures: this.getSupportedFeatures(),
    };
  }

  supportsFeature(feature: string): boolean {
    const supportedFeatures = [
      'hot-reload',
      'code-splitting',
      'tree-shaking',
      'source-maps',
      'css-extraction',
      'asset-optimization',
      'dev-server',
      'module-federation',
    ];
    return supportedFeatures.includes(feature);
  }

  getSupportedFeatures(): string[] {
    return [
      'hot-reload',
      'code-splitting',
      'tree-shaking',
      'source-maps',
      'css-extraction',
      'asset-optimization',
      'dev-server',
      'module-federation',
    ];
  }

  private getWebpackConfig(): Configuration {
    // Convert BundlerOptions to BalmJS config format
    const input = typeof this.options.entry === 'string' 
      ? this.options.entry 
      : this.options.entry;
    
    const output = this.options.output?.path || 'dist';
    
    // Use existing webpackConfig function
    return webpackConfig(input, output, {
      mode: this.options.mode,
      devtool: this.options.sourceMap ? 'source-map' : false,
      resolve: this.options.resolve,
      plugins: [],
      optimization: {
        minimize: this.options.optimization?.minimize,
        splitChunks: this.options.optimization?.splitChunks ? {} : false,
      },
    });
  }

  private extractAssets(stats: any): Asset[] {
    if (!stats.assets) return [];
    
    return stats.assets.map((asset: any) => ({
      name: asset.name,
      size: asset.size,
      type: this.getAssetType(asset.name),
      path: asset.name,
    }));
  }

  private getAssetType(filename: string): 'js' | 'css' | 'html' | 'image' | 'font' | 'other' {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'mjs':
        return 'js';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        return 'image';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'eot':
        return 'font';
      default:
        return 'other';
    }
  }

  private extractChunks(stats: any): Chunk[] {
    if (!stats.chunks) return [];
    
    return stats.chunks.map((chunk: any) => ({
      id: chunk.id,
      name: chunk.names?.[0] || chunk.id,
      size: chunk.size,
      files: chunk.files || [],
      modules: chunk.modules?.map((mod: any) => mod.name || mod.id) || [],
    }));
  }

  private calculateBundleSize(stats: any): number {
    if (!stats.assets) return 0;
    return stats.assets.reduce((total: number, asset: any) => total + asset.size, 0);
  }

  private createBundlerError(error: any): BundlerError {
    return {
      type: 'error',
      message: error.message || String(error),
      file: error.file,
      line: error.line,
      column: error.column,
      stack: error.stack,
    };
  }

  private createBundlerWarning(warning: any): BundlerError {
    return {
      type: 'warning',
      message: warning.message || String(warning),
      file: warning.file,
      line: warning.line,
      column: warning.column,
    };
  }

  private async processCompilerResult(error: any, stats: any): Promise<BuildResult> {
    const startTime = Date.now();
    const endTime = Date.now();
    
    if (error) {
      return {
        success: false,
        outputPath: this.options.output?.path || 'dist',
        assets: [],
        chunks: [],
        errors: [this.createBundlerError(error)],
        warnings: [],
        stats: {
          startTime,
          endTime,
          duration: endTime - startTime,
          bundleSize: 0,
          chunkCount: 0,
          assetCount: 0,
        },
      };
    }

    const info = stats.toJson();
    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();

    return {
      success: !hasErrors,
      outputPath: this.options.output?.path || 'dist',
      assets: this.extractAssets(info),
      chunks: this.extractChunks(info),
      errors: hasErrors ? info.errors?.map((err: any) => this.createBundlerError(err)) || [] : [],
      warnings: hasWarnings ? info.warnings?.map((warn: any) => this.createBundlerWarning(warn)) || [] : [],
      stats: {
        startTime,
        endTime,
        duration: endTime - startTime,
        bundleSize: this.calculateBundleSize(info),
        chunkCount: info.chunks?.length || 0,
        assetCount: info.assets?.length || 0,
      },
    };
  }

  private getWebpackVersion(): string {
    try {
      return webpack.version || '5.x.x';
    } catch {
      return 'unknown';
    }
  }
}