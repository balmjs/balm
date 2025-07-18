/**
 * Vite configuration mapper for BalmJS
 * Maps BalmJS configuration to Vite configuration
 */

import { InlineConfig, Plugin } from 'vite';
import { ModernBalmConfig } from '../../config/modern.js';
import path from 'node:path';

/**
 * Vite configuration mapping result
 */
export interface ViteConfigMapping {
  config: InlineConfig;
  plugins: Plugin[];
  warnings: string[];
}

/**
 * Vite configuration mapper class
 */
export class ViteConfigMapper {
  /**
   * Map BalmJS configuration to Vite configuration
   */
  static mapBalmConfigToVite(
    balmConfig: Partial<ModernBalmConfig>,
    baseConfig: InlineConfig = {}
  ): InlineConfig {
    const mapper = new ViteConfigMapper(balmConfig);
    return mapper.createViteConfig(baseConfig);
  }

  private balmConfig: Partial<ModernBalmConfig>;
  private warnings: string[] = [];

  constructor(balmConfig: Partial<ModernBalmConfig>) {
    this.balmConfig = balmConfig;
  }

  /**
   * Create complete Vite configuration
   */
  createViteConfig(baseConfig: InlineConfig = {}): InlineConfig {
    const config: InlineConfig = {
      ...baseConfig,
      
      // Basic configuration
      mode: this.mapMode(),
      base: this.mapBase(),
      root: this.mapRoot(),
      
      // Build configuration
      build: {
        ...baseConfig.build,
        ...this.mapBuildConfig(),
      },
      
      // Server configuration
      server: {
        ...baseConfig.server,
        ...this.mapServerConfig(),
      },
      
      // Preview configuration
      preview: {
        ...baseConfig.preview,
        ...this.mapPreviewConfig(),
      },
      
      // Resolve configuration
      resolve: {
        ...baseConfig.resolve,
        ...this.mapResolveConfig(),
      },
      
      // CSS configuration
      css: {
        ...baseConfig.css,
        ...this.mapCssConfig(),
      },
      
      // Define configuration
      define: {
        ...baseConfig.define,
        ...this.mapDefineConfig(),
      },
      
      // Plugins
      plugins: [
        ...(baseConfig.plugins || []),
        ...this.mapPlugins(),
      ],
      
      // Environment variables
      envPrefix: this.mapEnvPrefix(),
      
      // Optimization
      optimizeDeps: {
        ...baseConfig.optimizeDeps,
        ...this.mapOptimizeDeps(),
      },
    };

    // Apply conditional configurations
    this.applyConditionalConfig(config);
    
    return config;
  }

  /**
   * Get configuration warnings
   */
  getWarnings(): string[] {
    return [...this.warnings];
  }

  // Private mapping methods

  private mapMode(): 'development' | 'production' {
    return this.balmConfig.mode === 'production' ? 'production' : 'development';
  }

  private mapBase(): string {
    return this.balmConfig.paths?.publicPath || '/';
  }

  private mapRoot(): string {
    return this.balmConfig.paths?.root || process.cwd();
  }

  private mapBuildConfig() {
    const isDev = this.mapMode() === 'development';
    
    return {
      // Output directory
      outDir: this.balmConfig.paths?.output || 'dist',
      
      // Clean output directory
      emptyOutDir: this.balmConfig.features?.cleanOutput !== false,
      
      // Source maps
      sourcemap: this.mapSourceMap(),
      
      // Minification
      minify: isDev ? false : this.mapMinification(),
      
      // Target
      target: this.mapTarget(),
      
      // Asset handling
      assetsDir: 'assets',
      assetsInlineLimit: this.balmConfig.optimization?.assetInlineLimit || 4096,
      
      // CSS code splitting
      cssCodeSplit: this.balmConfig.features?.cssExtraction !== false,
      
      // Rollup options
      rollupOptions: this.mapRollupOptions(),
      
      // Library mode
      lib: this.mapLibraryMode(),
    };
  }

  private mapServerConfig() {
    const devServer = this.balmConfig.devServer || {};
    
    return {
      // Port and host
      port: devServer.port || 3000,
      host: devServer.host || 'localhost',
      
      // HTTPS
      https: devServer.https || false,
      
      // Open browser
      open: devServer.open || false,
      
      // CORS
      cors: devServer.cors !== false,
      
      // Proxy
      proxy: this.mapProxy(),
      
      // HMR
      hmr: this.balmConfig.features?.hmr !== false ? {
        port: devServer.hmrPort,
        host: devServer.hmrHost,
      } : false,
      
      // Middleware mode
      middlewareMode: devServer.middlewareMode || false,
      
      // File watching
      watch: {
        ignored: this.mapWatchIgnored(),
      },
    };
  }

  private mapPreviewConfig() {
    const devServer = this.balmConfig.devServer || {};
    
    return {
      port: devServer.previewPort || 4173,
      host: devServer.host || 'localhost',
      https: devServer.https || false,
      open: devServer.open || false,
      cors: devServer.cors !== false,
      proxy: this.mapProxy(),
    };
  }

  private mapResolveConfig() {
    return {
      // File extensions
      extensions: this.mapExtensions(),
      
      // Aliases
      alias: this.mapAliases(),
      
      // Conditions
      conditions: this.mapResolveConditions(),
      
      // Main fields
      mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
      
      // Dedupe
      dedupe: this.balmConfig.optimization?.dedupe || [],
    };
  }

  private mapCssConfig() {
    const css = this.balmConfig.css || {};
    
    return {
      // CSS modules
      modules: css.modules ? {
        localsConvention: css.modules.localsConvention || 'camelCase',
        generateScopedName: css.modules.generateScopedName || '[name]__[local]___[hash:base64:5]',
      } : false,
      
      // Preprocessor options
      preprocessorOptions: {
        scss: css.preprocessorOptions?.scss || {},
        sass: css.preprocessorOptions?.sass || {},
        less: css.preprocessorOptions?.less || {},
        stylus: css.preprocessorOptions?.stylus || {},
      },
      
      // PostCSS
      postcss: css.postcss || {},
      
      // Dev source map
      devSourcemap: this.balmConfig.features?.sourceMap !== false,
    };
  }

  private mapDefineConfig() {
    const define: Record<string, any> = {};
    
    // Environment variables
    if (this.balmConfig.env) {
      Object.entries(this.balmConfig.env).forEach(([key, value]) => {
        define[`process.env.${key}`] = JSON.stringify(value);
      });
    }
    
    // Mode-specific defines
    const isDev = this.mapMode() === 'development';
    define['process.env.NODE_ENV'] = JSON.stringify(isDev ? 'development' : 'production');
    define['__DEV__'] = isDev;
    define['__PROD__'] = !isDev;
    
    // Custom defines
    if (this.balmConfig.define) {
      Object.assign(define, this.balmConfig.define);
    }
    
    return define;
  }

  private mapPlugins(): Plugin[] {
    const plugins: Plugin[] = [];
    
    // Add framework-specific plugins
    this.addFrameworkPlugins(plugins);
    
    // Add feature-specific plugins
    this.addFeaturePlugins(plugins);
    
    // Add custom plugins
    if (this.balmConfig.plugins) {
      plugins.push(...this.balmConfig.plugins);
    }
    
    return plugins;
  }

  private mapEnvPrefix(): string | string[] {
    return this.balmConfig.envPrefix || 'VITE_';
  }

  private mapOptimizeDeps() {
    return {
      // Include dependencies
      include: this.balmConfig.optimization?.include || [],
      
      // Exclude dependencies
      exclude: this.balmConfig.optimization?.exclude || [],
      
      // Force optimization
      force: this.balmConfig.optimization?.force || false,
      
      // ESBuild options
      esbuildOptions: this.balmConfig.optimization?.esbuildOptions || {},
    };
  }

  private mapSourceMap(): boolean | 'inline' | 'hidden' {
    const sourceMap = this.balmConfig.features?.sourceMap;
    
    if (sourceMap === false) return false;
    if (sourceMap === 'inline') return 'inline';
    if (sourceMap === 'hidden') return 'hidden';
    
    return this.mapMode() === 'development';
  }

  private mapMinification(): boolean | 'terser' | 'esbuild' {
    if (this.balmConfig.features?.minification === false) return false;
    
    const minifier = this.balmConfig.optimization?.minifier;
    if (minifier === 'terser') return 'terser';
    if (minifier === 'esbuild') return 'esbuild';
    
    return 'esbuild'; // Default to esbuild for better performance
  }

  private mapTarget(): string | string[] {
    const target = this.balmConfig.target;
    
    if (target?.esVersion) {
      return target.esVersion;
    }
    
    if (target?.browsers) {
      // Convert browserslist to Vite target
      return 'modules'; // Modern browsers that support ES modules
    }
    
    return 'modules';
  }

  private mapRollupOptions() {
    const rollupOptions: any = {};
    
    // External dependencies
    if (this.balmConfig.externals) {
      rollupOptions.external = Object.keys(this.balmConfig.externals);
    }
    
    // Input configuration
    if (this.balmConfig.entry) {
      if (typeof this.balmConfig.entry === 'string') {
        rollupOptions.input = this.balmConfig.entry;
      } else if (typeof this.balmConfig.entry === 'object') {
        rollupOptions.input = this.balmConfig.entry;
      }
    }
    
    // Output configuration
    rollupOptions.output = {
      // Chunk file names
      chunkFileNames: this.balmConfig.output?.chunkFilename || 'assets/[name]-[hash].js',
      
      // Asset file names
      assetFileNames: this.balmConfig.output?.assetFilename || 'assets/[name]-[hash].[ext]',
      
      // Entry file names
      entryFileNames: this.balmConfig.output?.filename || '[name]-[hash].js',
      
      // Manual chunks
      manualChunks: this.mapManualChunks(),
    };
    
    return rollupOptions;
  }

  private mapLibraryMode() {
    const lib = this.balmConfig.library;
    
    if (!lib) return undefined;
    
    return {
      entry: lib.entry,
      name: lib.name,
      formats: lib.formats || ['es', 'umd'],
      fileName: lib.fileName,
    };
  }

  private mapProxy() {
    const proxy = this.balmConfig.devServer?.proxy;
    
    if (!proxy) return {};
    
    // Convert BalmJS proxy format to Vite proxy format
    const viteProxy: Record<string, any> = {};
    
    Object.entries(proxy).forEach(([path, config]) => {
      if (typeof config === 'string') {
        viteProxy[path] = {
          target: config,
          changeOrigin: true,
        };
      } else {
        viteProxy[path] = config;
      }
    });
    
    return viteProxy;
  }

  private mapWatchIgnored(): string[] {
    return [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/coverage/**',
      ...(this.balmConfig.watch?.ignored || []),
    ];
  }

  private mapExtensions(): string[] {
    const extensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'];
    
    // Add framework-specific extensions
    if (this.balmConfig.framework?.name === 'vue') {
      extensions.push('.vue');
    }
    
    if (this.balmConfig.framework?.name === 'svelte') {
      extensions.push('.svelte');
    }
    
    return extensions;
  }

  private mapAliases(): Record<string, string> {
    const aliases: Record<string, string> = {};
    
    // Add path aliases
    if (this.balmConfig.paths?.alias) {
      Object.assign(aliases, this.balmConfig.paths.alias);
    }
    
    // Add common aliases
    aliases['@'] = path.resolve(this.mapRoot(), 'src');
    aliases['~'] = path.resolve(this.mapRoot(), 'src');
    
    return aliases;
  }

  private mapResolveConditions(): string[] {
    const conditions = ['import', 'module', 'browser', 'default'];
    
    if (this.mapMode() === 'development') {
      conditions.unshift('development');
    } else {
      conditions.unshift('production');
    }
    
    return conditions;
  }

  private mapManualChunks() {
    const chunks = this.balmConfig.optimization?.splitChunks;
    
    if (!chunks) return undefined;
    
    // Convert BalmJS chunk configuration to Vite manual chunks
    if (typeof chunks === 'object' && chunks.cacheGroups) {
      const manualChunks: Record<string, string[]> = {};
      
      Object.entries(chunks.cacheGroups).forEach(([name, config]: [string, any]) => {
        if (config.test && typeof config.test === 'function') {
          // This is complex to convert, add a warning
          this.warnings.push(`Complex chunk configuration for '${name}' may not work as expected in Vite`);
        }
      });
      
      return manualChunks;
    }
    
    return undefined;
  }

  private addFrameworkPlugins(plugins: Plugin[]): void {
    const framework = this.balmConfig.framework?.name;
    
    try {
      switch (framework) {
        case 'react':
          const reactPlugin = require('@vitejs/plugin-react');
          plugins.push(reactPlugin({
            jsxRuntime: this.balmConfig.compiler?.options?.jsx === 'react-jsx' ? 'automatic' : 'classic',
            fastRefresh: this.balmConfig.features?.fastRefresh !== false,
          }));
          break;
          
        case 'vue':
          const vuePlugin = require('@vitejs/plugin-vue');
          plugins.push(vuePlugin(this.balmConfig.framework.options || {}));
          break;
          
        case 'svelte':
          const sveltePlugin = require('@sveltejs/vite-plugin-svelte');
          plugins.push(sveltePlugin(this.balmConfig.framework.options || {}));
          break;
          
        default:
          // No framework-specific plugins needed
          break;
      }
    } catch (error) {
      this.warnings.push(`Failed to load ${framework} plugin: ${error.message}`);
    }
  }

  private addFeaturePlugins(plugins: Plugin[]): void {
    // Legacy browser support
    if (this.balmConfig.features?.legacySupport) {
      try {
        const legacyPlugin = require('@vitejs/plugin-legacy');
        plugins.push(legacyPlugin({
          targets: this.balmConfig.target?.browsers || ['defaults'],
        }));
      } catch (error) {
        this.warnings.push(`Failed to load legacy plugin: ${error.message}`);
      }
    }
    
    // PWA support
    if (this.balmConfig.features?.pwa) {
      try {
        const pwaPlugin = require('vite-plugin-pwa');
        plugins.push(pwaPlugin(this.balmConfig.pwa || {}));
      } catch (error) {
        this.warnings.push(`Failed to load PWA plugin: ${error.message}`);
      }
    }
    
    // Bundle analyzer
    if (this.balmConfig.features?.bundleAnalyzer) {
      try {
        const analyzerPlugin = require('rollup-plugin-visualizer');
        plugins.push(analyzerPlugin({
          filename: 'dist/stats.html',
          open: true,
        }));
      } catch (error) {
        this.warnings.push(`Failed to load bundle analyzer plugin: ${error.message}`);
      }
    }
  }

  private applyConditionalConfig(config: InlineConfig): void {
    // Apply development-specific configuration
    if (this.mapMode() === 'development') {
      // Enable more detailed error overlay
      config.server = {
        ...config.server,
        fs: {
          strict: false,
        },
      };
    }
    
    // Apply production-specific configuration
    if (this.mapMode() === 'production') {
      // Enable more aggressive optimizations
      config.build = {
        ...config.build,
        reportCompressedSize: false, // Faster builds
        chunkSizeWarningLimit: 1000,
      };
    }
  }
}

/**
 * Helper function to create Vite config from BalmJS config
 */
export function createViteConfig(
  balmConfig: Partial<ModernBalmConfig>,
  baseConfig: InlineConfig = {}
): InlineConfig {
  return ViteConfigMapper.mapBalmConfigToVite(balmConfig, baseConfig);
}

/**
 * Helper function to validate Vite configuration
 */
export function validateViteConfig(config: InlineConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for common configuration issues
  if (config.build?.lib && !config.build.lib.entry) {
    errors.push('Library mode requires an entry point');
  }
  
  if (config.server?.port && (config.server.port < 1 || config.server.port > 65535)) {
    errors.push('Server port must be between 1 and 65535');
  }
  
  if (config.build?.target && typeof config.build.target === 'string') {
    const validTargets = ['es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'esnext', 'modules'];
    if (!validTargets.includes(config.build.target) && !config.build.target.startsWith('chrome') && !config.build.target.startsWith('firefox')) {
      errors.push(`Invalid build target: ${config.build.target}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}