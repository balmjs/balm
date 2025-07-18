/**
 * Unit tests for SWC configuration system
 */

import { SWCConfigMapper, SWCPresets } from '../config.js';
import { ModernBalmConfig } from '../../../config/modern.js';
import { CompilerOptions } from '../../base.js';

describe('SWCConfigMapper', () => {
  describe('mapBalmConfigToSWC', () => {
    it('should map basic configuration', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        target: {
          esVersion: 'es2020',
          browsers: ['defaults'],
        },
        features: {
          hmr: true,
          sourceMap: true,
          minification: false,
          splitting: true,
          treeshaking: true,
          cssExtraction: false,
          polyfillInjection: true,
          modernSyntax: true,
        },
      };

      const compilerOptions: CompilerOptions = {
        target: 'es2020',
        module: 'es6',
        sourceMap: true,
        minify: false,
      };

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.jsc?.target).toBe('es2020');
      expect(swcConfig.module?.type).toBe('es6');
      expect(swcConfig.sourceMaps).toBe(true);
      expect(swcConfig.minify).toBe(false);
    });

    it('should configure React transform', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        compiler: {
          type: 'swc',
          swc: {
            jsc: {
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      };

      const compilerOptions: CompilerOptions = {
        jsx: 'react-jsx',
      };

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.jsc?.parser?.jsx).toBe(true);
      expect(swcConfig.jsc?.transform?.react?.runtime).toBe('automatic');
    });

    it('should configure TypeScript', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        compiler: {
          type: 'swc',
          swc: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
            },
          },
        },
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

      const compilerOptions: CompilerOptions = {
        jsx: 'react-jsx',
      };

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.jsc?.parser?.syntax).toBe('typescript');
      expect(swcConfig.jsc?.parser?.tsx).toBe(true);
    });

    it('should configure decorators', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        target: {
          esVersion: 'es2022',
          features: {
            decorators: true,
          },
        },
      };

      const compilerOptions: CompilerOptions = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      };

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.jsc?.parser?.decorators).toBe(true);
      expect(swcConfig.jsc?.transform?.decoratorMetadata).toBe(true);
      expect(swcConfig.jsc?.transform?.legacyDecorator).toBe(true);
    });

    it('should configure modern features', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        target: {
          esVersion: 'es2022',
          features: {
            topLevelAwait: true,
            privateFields: true,
            dynamicImport: true,
            importMeta: true,
          },
        },
      };

      const compilerOptions: CompilerOptions = {};

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.jsc?.parser?.topLevelAwait).toBe(true);
      expect(swcConfig.jsc?.parser?.privateMethod).toBe(true);
      expect(swcConfig.jsc?.parser?.dynamicImport).toBe(true);
      expect(swcConfig.jsc?.parser?.importMeta).toBe(true);
    });

    it('should configure minification', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        features: {
          minification: true,
          hmr: true,
          splitting: true,
          treeshaking: true,
          sourceMap: true,
          cssExtraction: false,
          polyfillInjection: true,
          modernSyntax: true,
        },
      };

      const compilerOptions: CompilerOptions = {
        minify: true,
      };

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.minify).toBeTruthy();
      expect(typeof swcConfig.minify).toBe('object');
      
      if (typeof swcConfig.minify === 'object') {
        expect(swcConfig.minify.compress).toBeDefined();
        expect(swcConfig.minify.mangle).toBeDefined();
      }
    });

    it('should configure environment targets', () => {
      const balmConfig: Partial<ModernBalmConfig> = {
        target: {
          browsers: ['> 1%', 'last 2 versions'],
        },
      };

      const compilerOptions: CompilerOptions = {};

      const swcConfig = SWCConfigMapper.mapBalmConfigToSWC(balmConfig, compilerOptions);

      expect(swcConfig.env?.targets).toEqual(['> 1%', 'last 2 versions']);
      expect(swcConfig.env?.mode).toBe('usage');
      expect(swcConfig.env?.coreJs).toBe('3');
    });
  });

  describe('createProjectConfig', () => {
    it('should create React project config', () => {
      const config = SWCConfigMapper.createProjectConfig('react');

      expect(config.jsc?.parser?.syntax).toBe('typescript');
      expect(config.jsc?.parser?.tsx).toBe(true);
      expect(config.jsc?.parser?.jsx).toBe(true);
      expect(config.jsc?.transform?.react?.runtime).toBe('automatic');
    });

    it('should create Vue project config', () => {
      const config = SWCConfigMapper.createProjectConfig('vue');

      expect(config.jsc?.parser?.syntax).toBe('typescript');
      expect(config.jsc?.parser?.decorators).toBe(true);
      expect(config.jsc?.transform?.decoratorMetadata).toBe(true);
    });

    it('should create Angular project config', () => {
      const config = SWCConfigMapper.createProjectConfig('angular');

      expect(config.jsc?.parser?.syntax).toBe('typescript');
      expect(config.jsc?.parser?.decorators).toBe(true);
      expect(config.jsc?.transform?.decoratorMetadata).toBe(true);
      expect(config.jsc?.transform?.legacyDecorator).toBe(false);
      expect(config.jsc?.transform?.decoratorVersion).toBe('2022-03');
    });

    it('should create library project config', () => {
      const config = SWCConfigMapper.createProjectConfig('library');

      expect(config.jsc?.target).toBe('es2018');
      expect(config.jsc?.externalHelpers).toBe(true);
      expect(config.module?.type).toBe('es6');
      expect(config.minify).toBe(false);
    });

    it('should create Node.js project config', () => {
      const config = SWCConfigMapper.createProjectConfig('node');

      expect(config.jsc?.target).toBe('es2020');
      expect(config.module?.type).toBe('commonjs');
    });

    it('should merge custom options', () => {
      const config = SWCConfigMapper.createProjectConfig('react', {
        jsc: {
          target: 'es2022',
          loose: true,
        },
      });

      expect(config.jsc?.target).toBe('es2022');
      expect(config.jsc?.loose).toBe(true);
      // Should preserve React-specific config
      expect(config.jsc?.parser?.tsx).toBe(true);
      expect(config.jsc?.transform?.react?.runtime).toBe('automatic');
    });
  });

  describe('validateConfig', () => {
    it('should validate correct configuration', () => {
      const config = SWCConfigMapper.getDefaultConfig();
      const result = SWCConfigMapper.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid parser syntax', () => {
      const config = {
        jsc: {
          parser: {
            syntax: 'invalid' as any,
          },
        },
      };

      const result = SWCConfigMapper.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Invalid parser syntax: invalid. Must be 'typescript' or 'ecmascript'"
      );
    });

    it('should detect invalid target', () => {
      const config = {
        jsc: {
          target: 'invalid' as any,
        },
      };

      const result = SWCConfigMapper.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Invalid target: invalid');
    });

    it('should detect invalid module type', () => {
      const config = {
        module: {
          type: 'invalid' as any,
        },
      };

      const result = SWCConfigMapper.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Invalid module type: invalid');
    });

    it('should generate warnings for potential issues', () => {
      const config = {
        jsc: {
          parser: {
            syntax: 'typescript' as const,
            tsx: false,
            jsx: false,
          },
        },
      };

      const result = SWCConfigMapper.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain(
        'TypeScript syntax enabled but JSX/TSX disabled. Consider enabling TSX for React projects'
      );
    });

    it('should warn about ES5 with decorators', () => {
      const config = {
        jsc: {
          target: 'es5' as const,
          parser: {
            decorators: true,
          },
        },
      };

      const result = SWCConfigMapper.validateConfig(config);

      expect(result.warnings).toContain(
        'ES5 target with decorators may have compatibility issues'
      );
    });
  });

  describe('createProductionConfig', () => {
    it('should create production-optimized config', () => {
      const baseConfig = SWCConfigMapper.getDefaultConfig();
      const prodConfig = SWCConfigMapper.createProductionConfig(baseConfig);

      expect(prodConfig.minify).toBeTruthy();
      expect(prodConfig.sourceMaps).toBe(false);
      
      if (typeof prodConfig.minify === 'object') {
        expect(prodConfig.minify.compress?.drop_console).toBe(true);
        expect(prodConfig.minify.compress?.drop_debugger).toBe(true);
      }

      expect(prodConfig.jsc?.transform?.optimizer?.globals?.vars?.['process.env.NODE_ENV']).toBe('"production"');
    });
  });

  describe('createDevelopmentConfig', () => {
    it('should create development-optimized config', () => {
      const baseConfig = SWCConfigMapper.createProjectConfig('react');
      const devConfig = SWCConfigMapper.createDevelopmentConfig(baseConfig);

      expect(devConfig.minify).toBe(false);
      expect(devConfig.sourceMaps).toBe(true);
      expect(devConfig.jsc?.transform?.react?.development).toBe(true);
      expect(devConfig.jsc?.transform?.react?.refresh).toBe(true);
      expect(devConfig.jsc?.transform?.optimizer?.globals?.vars?.['process.env.NODE_ENV']).toBe('"development"');
    });
  });
});

describe('SWCPresets', () => {
  it('should provide React preset', () => {
    expect(SWCPresets.react.jsc?.parser?.syntax).toBe('typescript');
    expect(SWCPresets.react.jsc?.parser?.tsx).toBe(true);
    expect(SWCPresets.react.jsc?.transform?.react?.runtime).toBe('automatic');
  });

  it('should provide Vue preset', () => {
    expect(SWCPresets.vue.jsc?.parser?.syntax).toBe('typescript');
    expect(SWCPresets.vue.jsc?.parser?.decorators).toBe(true);
    expect(SWCPresets.vue.jsc?.transform?.decoratorMetadata).toBe(true);
  });

  it('should provide library preset', () => {
    expect(SWCPresets.library.jsc?.target).toBe('es2018');
    expect(SWCPresets.library.module?.type).toBe('es6');
    expect(SWCPresets.library.minify).toBe(false);
  });

  it('should provide Node.js preset', () => {
    expect(SWCPresets.node.jsc?.target).toBe('es2020');
    expect(SWCPresets.node.module?.type).toBe('commonjs');
  });

  it('should provide modern preset', () => {
    expect(SWCPresets.modern.jsc?.target).toBe('es2022');
    expect(SWCPresets.modern.jsc?.parser?.topLevelAwait).toBe(true);
    expect(SWCPresets.modern.jsc?.parser?.privateMethod).toBe(true);
  });

  it('should provide legacy preset', () => {
    expect(SWCPresets.legacy.jsc?.target).toBe('es5');
    expect(SWCPresets.legacy.jsc?.loose).toBe(true);
    expect(SWCPresets.legacy.env?.targets).toBe('ie 11');
  });
});