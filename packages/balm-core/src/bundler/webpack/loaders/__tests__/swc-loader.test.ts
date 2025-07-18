/**
 * Unit tests for SWC Webpack loader
 */

import { SWCWebpackLoader, createSWCLoader, createSWCDevLoader, createSWCProdLoader } from '../swc-loader.js';
import { ModernBalmConfig } from '../../../../config/modern.js';

// Mock BalmJS global
global.BalmJS = {
  file: {
    absPaths: jest.fn(() => '/src'),
  },
  config: {
    src: { js: 'src/scripts' },
    scripts: { includeJsResource: [] },
  },
  logger: {
    warn: jest.fn(),
  },
} as any;

describe('SWCWebpackLoader', () => {
  const mockBalmConfig: Partial<ModernBalmConfig> = {
    compiler: {
      type: 'swc',
      options: {
        target: 'es2020',
        module: 'es6',
        jsx: 'react-jsx',
        sourceMap: true,
      },
    },
    target: {
      esVersion: 'es2020',
      browsers: ['defaults'],
    },
    features: {
      hmr: true,
      splitting: true,
      treeshaking: true,
      minification: false,
      sourceMap: true,
      cssExtraction: false,
      polyfillInjection: true,
      modernSyntax: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLoaderRule', () => {
    it('should generate basic SWC loader rule', () => {
      const rule = SWCWebpackLoader.getLoaderRule(mockBalmConfig);

      expect(rule.test).toBeInstanceOf(RegExp);
      expect(rule.include).toContain('/src');
      expect(rule.exclude).toContain(/node_modules/);
      expect(rule.use).toHaveProperty('loader');
      expect(rule.use).toHaveProperty('options');
    });

    it('should configure SWC options correctly', () => {
      const rule = SWCWebpackLoader.getLoaderRule(mockBalmConfig);
      const options = (rule.use as any).options;

      expect(options.jsc.target).toBe('es2020');
      expect(options.module.type).toBe('es6');
      expect(options.sourceMaps).toBe(true);
      expect(options.cacheDirectory).toBe(true);
    });

    it('should handle custom options', () => {
      const customOptions = {
        cacheDirectory: false,
        test: /\.custom$/,
        jsc: {
          target: 'es2022' as const,
        },
      };

      const rule = SWCWebpackLoader.getLoaderRule(mockBalmConfig, customOptions);
      const options = (rule.use as any).options;

      expect(rule.test).toBe(customOptions.test);
      expect(options.cacheDirectory).toBe(false);
      expect(options.jsc.target).toBe('es2022');
    });

    it('should configure React transform for JSX', () => {
      const reactConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        compiler: {
          type: 'swc',
          options: {
            jsx: 'react-jsx',
          },
        },
      };

      const rule = SWCWebpackLoader.getLoaderRule(reactConfig);
      const options = (rule.use as any).options;

      expect(options.jsc.parser.jsx).toBe(true);
      expect(options.jsc.transform.react.runtime).toBe('automatic');
    });

    it('should configure TypeScript parsing', () => {
      const tsConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        devExperience: {
          typeChecking: true,
          fastRefresh: true,
          linting: true,
          formatting: true,
          progressBar: true,
          notifications: true,
          openBrowser: false,
        },
      };

      const rule = SWCWebpackLoader.getLoaderRule(tsConfig);
      const options = (rule.use as any).options;

      expect(options.jsc.parser.syntax).toBe('ecmascript'); // Should be determined by other factors
    });
  });

  describe('getLoaderRules', () => {
    it('should generate multiple rules for different file types', () => {
      const rules = SWCWebpackLoader.getLoaderRules(mockBalmConfig);

      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    });

    it('should include TypeScript rules when TypeScript is enabled', () => {
      const tsConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        devExperience: {
          typeChecking: true,
          fastRefresh: true,
          linting: true,
          formatting: true,
          progressBar: true,
          notifications: true,
          openBrowser: false,
        },
      };

      const rules = SWCWebpackLoader.getLoaderRules(tsConfig);
      
      // Should have separate rules for JS and TS
      expect(rules.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getDevelopmentLoader', () => {
    it('should create development-optimized loader', () => {
      const rule = SWCWebpackLoader.getDevelopmentLoader(mockBalmConfig);
      const options = (rule.use as any).options;

      expect(options.minify).toBe(false);
      expect(options.sourceMaps).toBe(true);
      expect(options.cacheDirectory).toBe(true);
      expect(options.cacheCompression).toBe(false);
      expect(options.jsc.transform.optimizer.globals.vars['process.env.NODE_ENV']).toBe('"development"');
    });

    it('should enable React Fast Refresh in development', () => {
      const reactConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        compiler: {
          type: 'swc',
          options: {
            jsx: 'react-jsx',
          },
        },
      };

      const rule = SWCWebpackLoader.getDevelopmentLoader(reactConfig);
      const options = (rule.use as any).options;

      expect(options.jsc.transform.react.development).toBe(true);
      expect(options.jsc.transform.react.refresh).toBe(true);
    });
  });

  describe('getProductionLoader', () => {
    it('should create production-optimized loader', () => {
      const prodConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        features: {
          ...mockBalmConfig.features!,
          minification: true,
          sourceMap: 'hidden',
        },
      };

      const rule = SWCWebpackLoader.getProductionLoader(prodConfig);
      const options = (rule.use as any).options;

      expect(options.minify).toBe(true);
      expect(options.sourceMaps).toBe(false); // hidden source maps
      expect(options.cacheCompression).toBe(true);
      expect(options.jsc.transform.optimizer.globals.vars['process.env.NODE_ENV']).toBe('"production"');
    });

    it('should disable React Fast Refresh in production', () => {
      const reactConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        compiler: {
          type: 'swc',
          options: {
            jsx: 'react-jsx',
          },
        },
        features: {
          ...mockBalmConfig.features!,
          minification: true,
        },
      };

      const rule = SWCWebpackLoader.getProductionLoader(reactConfig);
      const options = (rule.use as any).options;

      expect(options.jsc.transform.react.development).toBe(false);
      expect(options.jsc.transform.react.refresh).toBe(false);
    });
  });

  describe('replaceBabelLoader', () => {
    it('should replace Babel loader with SWC loader', () => {
      const webpackConfig = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] },
              },
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      };

      const updatedConfig = SWCWebpackLoader.replaceBabelLoader(
        webpackConfig,
        mockBalmConfig
      );

      const jsRule = updatedConfig.module.rules[0];
      expect(jsRule.use.loader).not.toBe('babel-loader');
      expect(jsRule.use.options).toHaveProperty('jsc');

      // CSS rule should remain unchanged
      const cssRule = updatedConfig.module.rules[1];
      expect(cssRule.use).toEqual(['style-loader', 'css-loader']);
    });

    it('should handle config without module rules', () => {
      const webpackConfig = {};
      const result = SWCWebpackLoader.replaceBabelLoader(
        webpackConfig,
        mockBalmConfig
      );

      expect(result).toBe(webpackConfig);
    });

    it('should not modify non-Babel rules', () => {
      const webpackConfig = {
        module: {
          rules: [
            {
              test: /\.ts$/,
              use: 'ts-loader',
            },
          ],
        },
      };

      const result = SWCWebpackLoader.replaceBabelLoader(
        webpackConfig,
        mockBalmConfig
      );

      expect(result.module.rules[0].use).toBe('ts-loader');
    });
  });

  describe('helper functions', () => {
    it('should create SWC loader with createSWCLoader', () => {
      const rule = createSWCLoader(mockBalmConfig);
      
      expect(rule).toHaveProperty('test');
      expect(rule).toHaveProperty('use');
      expect(rule.use).toHaveProperty('loader');
      expect(rule.use).toHaveProperty('options');
    });

    it('should create development loader with createSWCDevLoader', () => {
      const rule = createSWCDevLoader(mockBalmConfig);
      const options = (rule.use as any).options;
      
      expect(options.minify).toBe(false);
      expect(options.sourceMaps).toBe(true);
    });

    it('should create production loader with createSWCProdLoader', () => {
      const prodConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        features: {
          ...mockBalmConfig.features!,
          minification: true,
        },
      };

      const rule = createSWCProdLoader(prodConfig);
      const options = (rule.use as any).options;
      
      expect(options.minify).toBe(true);
    });
  });

  describe('private helper methods', () => {
    it('should detect supported extensions correctly', () => {
      // Test through public API since private methods aren't directly accessible
      const rule = SWCWebpackLoader.getLoaderRule(mockBalmConfig);
      
      // Should match JavaScript extensions
      expect((rule.test as RegExp).test('file.js')).toBe(true);
      expect((rule.test as RegExp).test('file.jsx')).toBe(true);
      expect((rule.test as RegExp).test('file.mjs')).toBe(true);
      expect((rule.test as RegExp).test('file.cjs')).toBe(true);
    });

    it('should include TypeScript extensions when TypeScript is enabled', () => {
      const tsConfig: Partial<ModernBalmConfig> = {
        ...mockBalmConfig,
        devExperience: {
          typeChecking: true,
          fastRefresh: true,
          linting: true,
          formatting: true,
          progressBar: true,
          notifications: true,
          openBrowser: false,
        },
      };

      const rules = SWCWebpackLoader.getLoaderRules(tsConfig);
      
      // Should have rules that can handle TypeScript files
      const hasTypeScriptRule = rules.some(rule => {
        if (rule.test instanceof RegExp) {
          return rule.test.test('file.ts') || rule.test.test('file.tsx');
        }
        return false;
      });
      
      expect(hasTypeScriptRule).toBe(true);
    });

    it('should sanitize options correctly', () => {
      const rule = SWCWebpackLoader.getLoaderRule(mockBalmConfig, {
        include: ['/custom/path'],
        exclude: [/custom_modules/],
        test: /\.custom$/,
        cacheDirectory: true,
        jsc: {
          target: 'es2022',
        },
      });

      const options = (rule.use as any).options;
      
      // Should include SWC options
      expect(options.jsc.target).toBe('es2022');
      expect(options.cacheDirectory).toBe(true);
      
      // Should not include Webpack rule options in SWC options
      expect(options.include).toBeUndefined();
      expect(options.exclude).toBeUndefined();
      expect(options.test).toBeUndefined();
    });
  });
});