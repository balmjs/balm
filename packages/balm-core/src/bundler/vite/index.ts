/**
 * Vite bundler implementation for BalmJS
 * Provides fast development server and optimized production builds
 */

import { createServer, build, preview, ViteDevServer, InlineConfig, BuildOptions } from 'vite';
import { BaseBundler, BundlerOptions, BuildResult, DevServer, BundlerConfig, Asset, Chunk, BundlerError, BuildStats } from '../base.js';
import { ViteConfigMapper } from './config.js';
import { getVitePlugins } from './plugins.js';
import { createHMRPlugins, HMRPresets } from './hmr.js';
import { ModernBalmConfig } from '../../config/modern.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Vite-specific options extending base bundler options
 */
export interface ViteOptions extends BundlerOptions {
  // Vite-specific configurations
  plugins?: any[];
  define?: Record<string, any>;
  css?: {
    modules?: boolean;
    preprocessorOptions?: Record<string, any>;
  };
  server?: {
    middlewareMode?: boolean;
    cors?: boolean;
    proxy?: Record<string, any>;
  };
  build?: {
    lib?: {
      entry: string;
      name?: string;
      formats?: string[];
    };
    rollupOptions?: any;
    minify?: boolean | 'terser' | 'esbuild';
    sourcemap?: boolean | 'inline' | 'hidden';
  };
  preview?: {
    port?: number;
    host?: string;
    strictPort?: boolean;
  };
}

/**
 * Vite development server wrapper
 */
class ViteDevServerWrapper implements DevServer {
  private server: ViteDevServer;
  private url: string;

  constructor(server: ViteDevServer) {
    this.server = server;
    this.url = '';
  }

  async start(): Promise<void> {
    await this.server.listen();
    this.url = this.server.resolvedUrls?.local[0] || `http://localhost:${this.server.config.server.port}`;
    console.log(`🚀 Vite dev server started at ${this.url}`);
  }

  async stop(): Promise<void> {
    await this.server.close();
    console.log('🛑 Vite dev server stopped');
  }

  async reload(): Promise<void> {
    this.server.ws.send({
      type: 'full-reload',
    });
  }

  getUrl(): string {
    return this.url;
  }

  isRunning(): boolean {
    return this.server.httpServer?.listening || false;
  }

  getViteServer(): ViteDevServer {
    return this.server;
  }
}

/**
 * Vite bundler implementation
 */
export class ViteBundler extends BaseBundler {
  private viteOptions: ViteOptions;
  private balmConfig?: Partial<ModernBalmConfig>;

  constructor(options: ViteOptions = {}, balmConfig?: Partial<ModernBalmConfig>) {
    super(options);
    this.viteOptions = this.mergeViteOptions(options);
    this.balmConfig = balmConfig;
  }

  /**
   * Build the project using Vite
   */
  async build(): Promise<BuildResult> {
    const startTime = Date.now();
    
    try {
      console.log('🏗️  Building with Vite...');
      
      const viteConfig = this.createViteConfig('build');
      const buildResult = await build(viteConfig);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Parse build results
      const result = await this.parseBuildResult(buildResult, startTime, endTime, duration);
      
      console.log(`✅ Build completed in ${duration}ms`);
      return result;
      
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.error('❌ Build failed:', error);
      
      return {
        success: false,
        outputPath: this.viteOptions.output?.path || 'dist',
        assets: [],
        chunks: [],
        errors: [{
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }],
        warnings: [],
        stats: {
          startTime,
          endTime,
          duration,
          bundleSize: 0,
          chunkCount: 0,
          assetCount: 0,
        },
      };
    }
  }

  /**
   * Start Vite development server
   */
  async serve(): Promise<DevServer> {
    try {
      console.log('🚀 Starting Vite dev server...');
      
      const viteConfig = this.createViteConfig('serve');
      const server = await createServer(viteConfig);
      
      const devServer = new ViteDevServerWrapper(server);
      this.devServer = devServer;
      
      return devServer;
      
    } catch (error) {
      console.error('❌ Failed to start Vite dev server:', error);
      throw error;
    }
  }

  /**
   * Watch for file changes (Vite handles this automatically in dev mode)
   */
  async watch(callback?: (result: BuildResult) => void): Promise<void> {
    if (this.options.mode === 'development') {
      // In development mode, Vite handles watching automatically
      const devServer = await this.serve();
      await devServer.start();
      
      if (callback) {
        // Simulate a successful build result for the callback
        const mockResult: BuildResult = {
          success: true,
          outputPath: 'dev',
          assets: [],
          chunks: [],
          errors: [],
          warnings: [],
          stats: {
            startTime: Date.now(),
            endTime: Date.now(),
            duration: 0,
            bundleSize: 0,
            chunkCount: 0,
            assetCount: 0,
          },
        };
        callback(mockResult);
      }
    } else {
      // For production, we can use Vite's build watch mode
      const viteConfig = this.createViteConfig('build');
      viteConfig.build = {
        ...viteConfig.build,
        watch: {},
      };
      
      await build(viteConfig);
    }
  }

  /**
   * Create preview server for production build
   */
  async preview(): Promise<DevServer> {
    try {
      console.log('🔍 Starting Vite preview server...');
      
      const previewServer = await preview({
        preview: {
          port: this.viteOptions.preview?.port || 4173,
          host: this.viteOptions.preview?.host || 'localhost',
          strictPort: this.viteOptions.preview?.strictPort || false,
        },
      });
      
      // Create a wrapper for the preview server
      const devServer: DevServer = {
        async start() {
          // Preview server starts automatically
          console.log(`🔍 Preview server started at http://localhost:${previewServer.config.preview.port}`);
        },
        async stop() {
          // Close preview server
          console.log('🛑 Preview server stopped');
        },
        async reload() {
          // Preview server doesn't support reload
          console.warn('⚠️  Preview server does not support reload');
        },
        getUrl() {
          return `http://localhost:${previewServer.config.preview.port}`;
        },
        isRunning() {
          return true; // Preview server is running if created successfully
        },
      };
      
      return devServer;
      
    } catch (error) {
      console.error('❌ Failed to start Vite preview server:', error);
      throw error;
    }
  }

  /**
   * Get Vite bundler configuration
   */
  getConfig(): BundlerConfig {
    return {
      name: 'vite',
      version: this.getViteVersion(),
      options: this.viteOptions,
      supportedFeatures: this.getSupportedFeatures(),
    };
  }

  /**
   * Check if Vite supports a specific feature
   */
  supportsFeature(feature: string): boolean {
    const supportedFeatures = this.getSupportedFeatures();
    return supportedFeatures.includes(feature);
  }

  /**
   * Get list of features supported by Vite
   */
  getSupportedFeatures(): string[] {
    return [
      'hot-reload',
      'fast-refresh',
      'typescript',
      'jsx',
      'css-modules',
      'css-preprocessing',
      'tree-shaking',
      'code-splitting',
      'dynamic-imports',
      'web-workers',
      'wasm',
      'json-imports',
      'asset-imports',
      'env-variables',
      'proxy',
      'https',
      'library-mode',
      'ssr',
      'legacy-browser-support',
    ];
  }

  // Private helper methods

  private mergeViteOptions(options: ViteOptions): ViteOptions {
    const defaults = this.getDefaultViteOptions();
    return {
      ...defaults,
      ...options,
      output: { ...defaults.output, ...options.output },
      resolve: { ...defaults.resolve, ...options.resolve },
      devServer: { ...defaults.devServer, ...options.devServer },
      optimization: { ...defaults.optimization, ...options.optimization },
      css: { ...defaults.css, ...options.css },
      server: { ...defaults.server, ...options.server },
      build: { ...defaults.build, ...options.build },
      preview: { ...defaults.preview, ...options.preview },
    };
  }

  private getDefaultViteOptions(): ViteOptions {
    return {
      ...this.getDefaultOptions(),
      plugins: [],
      define: {},
      css: {
        modules: false,
        preprocessorOptions: {},
      },
      server: {
        middlewareMode: false,
        cors: true,
        proxy: {},
      },
      build: {
        minify: 'esbuild',
        sourcemap: false,
      },
      preview: {
        port: 4173,
        host: 'localhost',
        strictPort: false,
      },
    };
  }

  private createViteConfig(command: 'build' | 'serve'): InlineConfig {
    // Get plugins from BalmJS configuration
    const balmPlugins = this.balmConfig ? getVitePlugins(this.balmConfig) : [];
    
    // Get HMR plugins for development
    const hmrPlugins = command === 'serve' && this.balmConfig ? 
      createHMRPlugins(this.balmConfig, this.getHMRPreset()) : [];
    
    const baseConfig: InlineConfig = {
      mode: this.options.mode,
      plugins: [
        ...balmPlugins,
        ...hmrPlugins,
        ...(this.viteOptions.plugins || []),
      ],
      define: this.viteOptions.define || {},
      
      // Root and base configuration
      root: process.cwd(),
      base: this.viteOptions.output?.publicPath || '/',
      
      // Resolve configuration
      resolve: {
        extensions: this.viteOptions.resolve?.extensions,
        alias: this.viteOptions.resolve?.alias,
      },
      
      // CSS configuration
      css: this.viteOptions.css,
      
      // Environment variables
      envPrefix: 'VITE_',
    };

    if (command === 'serve') {
      // Development server configuration
      baseConfig.server = {
        port: this.viteOptions.devServer?.port || 3000,
        host: this.viteOptions.devServer?.host || 'localhost',
        open: this.viteOptions.devServer?.open || false,
        cors: this.viteOptions.server?.cors !== false,
        proxy: this.viteOptions.server?.proxy,
        hmr: this.viteOptions.devServer?.hot !== false,
      };
    } else {
      // Build configuration
      baseConfig.build = {
        outDir: this.viteOptions.output?.path || 'dist',
        emptyOutDir: this.viteOptions.output?.clean !== false,
        sourcemap: this.viteOptions.build?.sourcemap || this.viteOptions.sourceMap,
        minify: this.viteOptions.build?.minify || (this.options.mode === 'production' ? 'esbuild' : false),
        target: this.viteOptions.target || 'modules',
        rollupOptions: this.viteOptions.build?.rollupOptions || {},
        lib: this.viteOptions.build?.lib,
      };
    }

    // Apply BalmJS configuration if available
    if (this.balmConfig) {
      return ViteConfigMapper.mapBalmConfigToVite(this.balmConfig, baseConfig);
    }

    return baseConfig;
  }

  private async parseBuildResult(
    buildResult: any,
    startTime: number,
    endTime: number,
    duration: number
  ): Promise<BuildResult> {
    const outputPath = this.viteOptions.output?.path || 'dist';
    const assets: Asset[] = [];
    const chunks: Chunk[] = [];
    let totalSize = 0;

    try {
      // Read the output directory to get asset information
      if (fs.existsSync(outputPath)) {
        const files = await this.readDirRecursive(outputPath);
        
        for (const file of files) {
          const stats = fs.statSync(file);
          const relativePath = path.relative(outputPath, file);
          const ext = path.extname(file).toLowerCase();
          
          let type: Asset['type'] = 'other';
          if (['.js', '.mjs'].includes(ext)) type = 'js';
          else if (ext === '.css') type = 'css';
          else if (ext === '.html') type = 'html';
          else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) type = 'image';
          else if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) type = 'font';
          
          assets.push({
            name: relativePath,
            size: stats.size,
            type,
            path: file,
          });
          
          totalSize += stats.size;
          
          // Create chunks for JS files
          if (type === 'js') {
            chunks.push({
              id: relativePath,
              name: path.basename(file, ext),
              size: stats.size,
              files: [relativePath],
              modules: [], // Vite doesn't provide detailed module info easily
            });
          }
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not parse build assets:', error);
    }

    return {
      success: true,
      outputPath,
      assets,
      chunks,
      errors: [],
      warnings: [],
      stats: {
        startTime,
        endTime,
        duration,
        bundleSize: totalSize,
        chunkCount: chunks.length,
        assetCount: assets.length,
      },
    };
  }

  private async readDirRecursive(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        files.push(...await this.readDirRecursive(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private getViteVersion(): string {
    try {
      const vitePackage = require('vite/package.json');
      return vitePackage.version;
    } catch {
      return 'unknown';
    }
  }

  private getHMRPreset(): any {
    const framework = this.balmConfig?.framework?.name || 'vanilla';
    return HMRPresets[framework as keyof typeof HMRPresets] || HMRPresets.vanilla;
  }
}

/**
 * Create a new Vite bundler instance
 */
export function createViteBundler(
  options: ViteOptions = {},
  balmConfig?: Partial<ModernBalmConfig>
): ViteBundler {
  return new ViteBundler(options, balmConfig);
}

/**
 * Check if Vite is available
 */
export function isViteAvailable(): boolean {
  try {
    require.resolve('vite');
    return true;
  } catch {
    return false;
  }
}