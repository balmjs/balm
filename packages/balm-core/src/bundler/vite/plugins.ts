/**
 * Vite plugin adapter system for BalmJS
 * Converts BalmJS plugins to Vite plugins and provides built-in plugin support
 */

import { Plugin, PluginOption } from 'vite';
import { ModernBalmConfig } from '../../config/modern.js';

/**
 * BalmJS plugin interface
 */
export interface BalmPlugin {
  name: string;
  apply?: 'build' | 'serve' | ((config: any) => boolean);
  configResolved?: (config: any) => void;
  buildStart?: (options: any) => void;
  transform?: (code: string, id: string) => string | { code: string; map?: any };
  generateBundle?: (options: any, bundle: any) => void;
  writeBundle?: (options: any, bundle: any) => void;
}

/**
 * Plugin adapter configuration
 */
export interface PluginAdapterConfig {
  enableBuiltins?: boolean;
  customPlugins?: BalmPlugin[];
  pluginOptions?: Record<string, any>;
}

/**
 * Vite plugin adapter for BalmJS
 */
export class BalmVitePluginAdapter {
  private balmConfig: Partial<ModernBalmConfig>;
  private adapterConfig: PluginAdapterConfig;

  constructor(
    balmConfig: Partial<ModernBalmConfig>,
    adapterConfig: PluginAdapterConfig = {}
  ) {
    this.balmConfig = balmConfig;
    this.adapterConfig = {
      enableBuiltins: true,
      customPlugins: [],
      pluginOptions: {},
      ...adapterConfig,
    };
  }

  /**
   * Get all Vite plugins for the current configuration
   */
  getPlugins(): PluginOption[] {
    const plugins: PluginOption[] = [];

    // Add built-in plugins
    if (this.adapterConfig.enableBuiltins) {
      plugins.push(...this.getBuiltinPlugins());
    }

    // Add framework-specific plugins
    plugins.push(...this.getFrameworkPlugins());

    // Add feature-specific plugins
    plugins.push(...this.getFeaturePlugins());

    // Add custom BalmJS plugins (converted to Vite plugins)
    plugins.push(...this.convertBalmPlugins());

    // Add user-defined Vite plugins
    if (this.balmConfig.plugins) {
      plugins.push(...this.balmConfig.plugins);
    }

    return plugins.filter(Boolean);
  }

  /**
   * Convert BalmJS plugin to Vite plugin
   */
  convertBalmPlugin(balmPlugin: BalmPlugin): Plugin {
    return {
      name: `balm:${balmPlugin.name}`,
      apply: balmPlugin.apply,
      
      configResolved(config) {
        if (balmPlugin.configResolved) {
          balmPlugin.configResolved(config);
        }
      },
      
      buildStart(options) {
        if (balmPlugin.buildStart) {
          balmPlugin.buildStart(options);
        }
      },
      
      transform(code, id) {
        if (balmPlugin.transform) {
          const result = balmPlugin.transform(code, id);
          if (typeof result === 'string') {
            return { code: result };
          }
          return result;
        }
        return null;
      },
      
      generateBundle(options, bundle) {
        if (balmPlugin.generateBundle) {
          balmPlugin.generateBundle(options, bundle);
        }
      },
      
      writeBundle(options, bundle) {
        if (balmPlugin.writeBundle) {
          balmPlugin.writeBundle(options, bundle);
        }
      },
    };
  }

  // Private methods

  private getBuiltinPlugins(): PluginOption[] {
    const plugins: PluginOption[] = [];

    // Add essential Vite plugins that are commonly needed
    plugins.push(this.createEnvironmentPlugin());
    plugins.push(this.createAliasPlugin());
    plugins.push(this.createDefinePlugin());

    return plugins;
  }

  private getFrameworkPlugins(): PluginOption[] {
    const plugins: PluginOption[] = [];
    const framework = this.balmConfig.framework?.name;

    try {
      switch (framework) {
        case 'react':
          plugins.push(this.createReactPlugin());
          break;
          
        case 'vue':
          plugins.push(this.createVuePlugin());
          break;
          
        case 'svelte':
          plugins.push(this.createSveltePlugin());
          break;
          
        case 'preact':
          plugins.push(this.createPreactPlugin());
          break;
          
        case 'lit':
          plugins.push(this.createLitPlugin());
          break;
          
        default:
          // No framework-specific plugins
          break;
      }
    } catch (error) {
      console.warn(`⚠️  Failed to load ${framework} plugin:`, error.message);
    }

    return plugins.filter(Boolean);
  }

  private getFeaturePlugins(): PluginOption[] {
    const plugins: PluginOption[] = [];
    const features = this.balmConfig.features || {};

    // TypeScript support
    if (features.typescript !== false) {
      plugins.push(this.createTypeScriptPlugin());
    }

    // Legacy browser support
    if (features.legacySupport) {
      plugins.push(this.createLegacyPlugin());
    }

    // PWA support
    if (features.pwa) {
      plugins.push(this.createPWAPlugin());
    }

    // Bundle analyzer
    if (features.bundleAnalyzer) {
      plugins.push(this.createBundleAnalyzerPlugin());
    }

    // ESLint integration
    if (features.eslint) {
      plugins.push(this.createESLintPlugin());
    }

    // Mock support for development
    if (features.mock && this.balmConfig.mode === 'development') {
      plugins.push(this.createMockPlugin());
    }

    // Dynamic imports
    if (features.dynamicImports) {
      plugins.push(this.createDynamicImportPlugin());
    }

    // Web Workers
    if (features.webWorkers) {
      plugins.push(this.createWebWorkerPlugin());
    }

    return plugins.filter(Boolean);
  }

  private convertBalmPlugins(): PluginOption[] {
    const plugins: PluginOption[] = [];

    if (this.adapterConfig.customPlugins) {
      for (const balmPlugin of this.adapterConfig.customPlugins) {
        plugins.push(this.convertBalmPlugin(balmPlugin));
      }
    }

    return plugins;
  }

  // Plugin creators

  private createEnvironmentPlugin(): Plugin {
    return {
      name: 'balm:environment',
      config(config, { mode }) {
        // Ensure environment variables are properly set
        config.define = config.define || {};
        config.define['process.env.NODE_ENV'] = JSON.stringify(mode);
        
        // Add custom environment variables
        if (this.balmConfig.env) {
          Object.entries(this.balmConfig.env).forEach(([key, value]) => {
            config.define![`process.env.${key}`] = JSON.stringify(value);
          });
        }
      },
    };
  }

  private createAliasPlugin(): Plugin {
    return {
      name: 'balm:alias',
      config(config) {
        // Set up path aliases
        config.resolve = config.resolve || {};
        config.resolve.alias = {
          ...config.resolve.alias,
          ...this.balmConfig.paths?.alias,
        };
      },
    };
  }

  private createDefinePlugin(): Plugin {
    return {
      name: 'balm:define',
      config(config) {
        // Add custom defines
        if (this.balmConfig.define) {
          config.define = {
            ...config.define,
            ...this.balmConfig.define,
          };
        }
      },
    };
  }

  private createReactPlugin(): PluginOption | null {
    try {
      const react = require('@vitejs/plugin-react');
      const options = {
        jsxRuntime: this.balmConfig.compiler?.options?.jsx === 'react-jsx' ? 'automatic' : 'classic',
        fastRefresh: this.balmConfig.features?.fastRefresh !== false,
        ...this.adapterConfig.pluginOptions?.react,
      };
      
      return react(options);
    } catch (error) {
      console.warn('⚠️  @vitejs/plugin-react not found. Install it to enable React support.');
      return null;
    }
  }

  private createVuePlugin(): PluginOption | null {
    try {
      const vue = require('@vitejs/plugin-vue');
      const options = {
        ...this.balmConfig.framework?.options,
        ...this.adapterConfig.pluginOptions?.vue,
      };
      
      return vue(options);
    } catch (error) {
      console.warn('⚠️  @vitejs/plugin-vue not found. Install it to enable Vue support.');
      return null;
    }
  }

  private createSveltePlugin(): PluginOption | null {
    try {
      const svelte = require('@sveltejs/vite-plugin-svelte');
      const options = {
        ...this.balmConfig.framework?.options,
        ...this.adapterConfig.pluginOptions?.svelte,
      };
      
      return svelte(options);
    } catch (error) {
      console.warn('⚠️  @sveltejs/vite-plugin-svelte not found. Install it to enable Svelte support.');
      return null;
    }
  }

  private createPreactPlugin(): PluginOption | null {
    try {
      const preact = require('@preact/preset-vite');
      const options = {
        ...this.adapterConfig.pluginOptions?.preact,
      };
      
      return preact(options);
    } catch (error) {
      console.warn('⚠️  @preact/preset-vite not found. Install it to enable Preact support.');
      return null;
    }
  }

  private createLitPlugin(): PluginOption | null {
    try {
      const lit = require('@vitejs/plugin-lit');
      const options = {
        ...this.adapterConfig.pluginOptions?.lit,
      };
      
      return lit(options);
    } catch (error) {
      console.warn('⚠️  @vitejs/plugin-lit not found. Install it to enable Lit support.');
      return null;
    }
  }

  private createTypeScriptPlugin(): PluginOption | null {
    // Vite has built-in TypeScript support, but we can enhance it
    return {
      name: 'balm:typescript',
      config(config) {
        // Ensure TypeScript files are included in resolve extensions
        config.resolve = config.resolve || {};
        config.resolve.extensions = [
          '.ts', '.tsx', '.mts', '.cts',
          ...(config.resolve.extensions || []),
        ];
      },
    };
  }

  private createLegacyPlugin(): PluginOption | null {
    try {
      const legacy = require('@vitejs/plugin-legacy');
      const options = {
        targets: this.balmConfig.target?.browsers || ['defaults'],
        additionalLegacyPolyfills: this.balmConfig.polyfills?.additional || [],
        modernPolyfills: this.balmConfig.polyfills?.modern !== false,
        ...this.adapterConfig.pluginOptions?.legacy,
      };
      
      return legacy(options);
    } catch (error) {
      console.warn('⚠️  @vitejs/plugin-legacy not found. Install it to enable legacy browser support.');
      return null;
    }
  }

  private createPWAPlugin(): PluginOption | null {
    try {
      const pwa = require('vite-plugin-pwa');
      const options = {
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
        ...this.balmConfig.pwa,
        ...this.adapterConfig.pluginOptions?.pwa,
      };
      
      return pwa(options);
    } catch (error) {
      console.warn('⚠️  vite-plugin-pwa not found. Install it to enable PWA support.');
      return null;
    }
  }

  private createBundleAnalyzerPlugin(): PluginOption | null {
    try {
      const analyzer = require('rollup-plugin-visualizer');
      const options = {
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        ...this.adapterConfig.pluginOptions?.bundleAnalyzer,
      };
      
      return analyzer(options);
    } catch (error) {
      console.warn('⚠️  rollup-plugin-visualizer not found. Install it to enable bundle analysis.');
      return null;
    }
  }

  private createESLintPlugin(): PluginOption | null {
    try {
      const eslint = require('vite-plugin-eslint');
      const options = {
        cache: true,
        include: ['src/**/*.{js,jsx,ts,tsx,vue,svelte}'],
        exclude: ['node_modules', 'dist'],
        ...this.adapterConfig.pluginOptions?.eslint,
      };
      
      return eslint(options);
    } catch (error) {
      console.warn('⚠️  vite-plugin-eslint not found. Install it to enable ESLint integration.');
      return null;
    }
  }

  private createMockPlugin(): PluginOption | null {
    try {
      const mock = require('vite-plugin-mock');
      const options = {
        mockPath: 'mock',
        localEnabled: true,
        prodEnabled: false,
        ...this.adapterConfig.pluginOptions?.mock,
      };
      
      return mock(options);
    } catch (error) {
      console.warn('⚠️  vite-plugin-mock not found. Install it to enable mock support.');
      return null;
    }
  }

  private createDynamicImportPlugin(): PluginOption {
    return {
      name: 'balm:dynamic-import',
      generateBundle(options, bundle) {
        // Enhance dynamic import handling
        Object.keys(bundle).forEach(fileName => {
          const chunk = bundle[fileName];
          if (chunk.type === 'chunk' && chunk.isDynamicEntry) {
            // Add metadata for dynamic chunks
            chunk.viteMetadata = {
              ...chunk.viteMetadata,
              isDynamicImport: true,
            };
          }
        });
      },
    };
  }

  private createWebWorkerPlugin(): PluginOption {
    return {
      name: 'balm:web-worker',
      config(config) {
        // Configure worker handling
        config.worker = {
          format: 'es',
          plugins: [],
          ...config.worker,
        };
      },
    };
  }
}

/**
 * Create plugin adapter instance
 */
export function createPluginAdapter(
  balmConfig: Partial<ModernBalmConfig>,
  adapterConfig?: PluginAdapterConfig
): BalmVitePluginAdapter {
  return new BalmVitePluginAdapter(balmConfig, adapterConfig);
}

/**
 * Get all plugins for a BalmJS configuration
 */
export function getVitePlugins(
  balmConfig: Partial<ModernBalmConfig>,
  adapterConfig?: PluginAdapterConfig
): PluginOption[] {
  const adapter = createPluginAdapter(balmConfig, adapterConfig);
  return adapter.getPlugins();
}

/**
 * Plugin registry for managing available plugins
 */
export class PluginRegistry {
  private static plugins = new Map<string, () => PluginOption | null>();

  /**
   * Register a plugin factory
   */
  static register(name: string, factory: () => PluginOption | null): void {
    this.plugins.set(name, factory);
  }

  /**
   * Get a plugin by name
   */
  static get(name: string): PluginOption | null {
    const factory = this.plugins.get(name);
    return factory ? factory() : null;
  }

  /**
   * Check if a plugin is available
   */
  static has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Get all available plugin names
   */
  static getAvailable(): string[] {
    return Array.from(this.plugins.keys());
  }
}

/**
 * Built-in plugin presets
 */
export const PluginPresets = {
  /**
   * React development preset
   */
  react: (balmConfig: Partial<ModernBalmConfig>) => {
    const adapter = createPluginAdapter(balmConfig);
    return [
      adapter.createReactPlugin(),
      adapter.createTypeScriptPlugin(),
      adapter.createESLintPlugin(),
    ].filter(Boolean);
  },

  /**
   * Vue development preset
   */
  vue: (balmConfig: Partial<ModernBalmConfig>) => {
    const adapter = createPluginAdapter(balmConfig);
    return [
      adapter.createVuePlugin(),
      adapter.createTypeScriptPlugin(),
      adapter.createESLintPlugin(),
    ].filter(Boolean);
  },

  /**
   * Library development preset
   */
  library: (balmConfig: Partial<ModernBalmConfig>) => {
    const adapter = createPluginAdapter(balmConfig);
    return [
      adapter.createTypeScriptPlugin(),
      adapter.createBundleAnalyzerPlugin(),
    ].filter(Boolean);
  },

  /**
   * Full-featured application preset
   */
  full: (balmConfig: Partial<ModernBalmConfig>) => {
    const adapter = createPluginAdapter(balmConfig);
    return adapter.getPlugins();
  },
};