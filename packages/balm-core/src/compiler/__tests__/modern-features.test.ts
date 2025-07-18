/**
 * Tests for Modern Features Compiler Support
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  ModernFeaturesCompilerSupport, 
  createModernFeaturesCompilerSupport,
  generateModernFeaturesCompilerConfigs,
  testModernSyntax
} from '../modern-features.js';
import { ModernBalmConfig } from '../../config/modern.js';

// Mock dependencies
vi.mock('../detector.js');
vi.mock('../target-resolver.js');

describe('ModernFeaturesCompilerSupport', () => {
  let support: ModernFeaturesCompilerSupport;
  let mockConfig: Partial<ModernBalmConfig>;

  beforeEach(() => {
    mockConfig = {
      features: {
        hmr: true,
        splitting: true,
        treeshaking: true,
        minification: true,
        sourceMap: true,
        cssExtraction: true,
        polyfillInjection: true,
        modernSyntax: true,
      },
    };

    // Mock detector
    const mockDetector = {
      detectFeatures: vi.fn().mockResolvedValue({
        featuresUsed: [
          {
            feature: { name: 'optional-chaining', description: 'Optional chaining operator' },
            count: 5,
            locations: [],
          },
          {
            feature: { name: 'nullish-coalescing', description: 'Nullish coalescing operator' },
            count: 3,
            locations: [],
          },
          {
            feature: { name: 'private-fields', description: 'Private class fields' },
            count: 2,
            locations: [],
          },
          {
            feature: { name: 'top-level-await', description: 'Top-level await' },
            count: 1,
            locations: [],
          },
        ],
        totalFeatures: 4,
        modernFeatureUsage: 0.8,
        compatibilityScore: 0.9,
      }),
      detectFeaturesInCode: vi.fn().mockResolvedValue([
        { feature: { name: 'optional-chaining', description: 'Optional chaining' } },
        { feature: { name: 'arrow-functions', description: 'Arrow functions' } },
      ]),
    };

    // Mock target resolver
    const mockTargetResolver = {
      resolveTargetEnvironment: vi.fn().mockReturnValue({
        browsers: ['chrome >= 90', 'firefox >= 88'],
        supportedFeatures: ['arrow-functions', 'const-let', 'optional-chaining'],
        polyfillsNeeded: ['nullish-coalescing', 'private-fields'],
        nodeVersion: '16.0.0',
      }),
      generateBrowserslistConfig: vi.fn().mockReturnValue(['chrome >= 90', 'firefox >= 88']),
    };

    vi.doMock('../../features/detector.js', () => ({
      ModernFeaturesDetector: vi.fn(() => mockDetector),
    }));

    vi.doMock('../../features/target-resolver.js', () => ({
      TargetConfigResolver: vi.fn(() => mockTargetResolver),
    }));

    support = new ModernFeaturesCompilerSupport(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      const defaultSupport = new ModernFeaturesCompilerSupport({});
      expect(defaultSupport).toBeInstanceOf(ModernFeaturesCompilerSupport);
    });

    it('should merge custom features configuration', () => {
      const customConfig = {
        enabled: false,
        target: 'es2021',
        loose: true,
      };
      
      const customSupport = new ModernFeaturesCompilerSupport(mockConfig, customConfig);
      expect(customSupport).toBeInstanceOf(ModernFeaturesCompilerSupport);
    });
  });

  describe('generateCompilerConfigs', () => {
    it('should generate compiler configurations for modern features', async () => {
      const result = await support.generateCompilerConfigs();

      expect(result).toBeDefined();
      expect(result.swc).toBeDefined();
      expect(result.babel).toBeDefined();
      expect(result.supportedFeatures).toBeDefined();
      expect(result.unsupportedFeatures).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.warnings).toBeDefined();
    });

    it('should handle project path parameter', async () => {
      const customPath = '/custom/project/path';
      const result = await support.generateCompilerConfigs(customPath);

      expect(result).toBeDefined();
      expect(result.swc).toBeDefined();
      expect(result.babel).toBeDefined();
    });
  });

  describe('generateSWCConfig', () => {
    it('should generate SWC configuration with modern features', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'optional-chaining', description: 'Optional chaining' },
            count: 5,
            locations: [],
          },
          {
            feature: { name: 'private-fields', description: 'Private fields' },
            count: 2,
            locations: [],
          },
          {
            feature: { name: 'jsx', description: 'JSX syntax' },
            count: 3,
            locations: [],
          },
        ],
        totalFeatures: 3,
        modernFeatureUsage: 0.8,
        compatibilityScore: 0.9,
      };

      const config = support.generateSWCConfig(featureDetection);

      expect(config.jsc).toBeDefined();
      expect(config.jsc.target).toBe('es2022');
      expect(config.jsc.parser.privateMethod).toBe(true);
      expect(config.jsc.parser.jsx).toBe(true);
      expect(config.jsc.transform.react).toBeDefined();
    });

    it('should configure TypeScript syntax when TypeScript is detected', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'typescript', description: 'TypeScript' },
            count: 10,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.5,
        compatibilityScore: 0.9,
      };

      const config = support.generateSWCConfig(featureDetection);

      expect(config.jsc.parser.syntax).toBe('typescript');
    });

    it('should enable decorators when decorators are detected', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'decorators', description: 'Decorators' },
            count: 2,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.3,
        compatibilityScore: 0.8,
      };

      const config = support.generateSWCConfig(featureDetection);

      expect(config.jsc.parser.decorators).toBe(true);
      expect(config.jsc.transform.legacyDecorator).toBe(true);
    });
  });

  describe('generateBabelConfig', () => {
    it('should generate Babel configuration with modern features', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'optional-chaining', description: 'Optional chaining' },
            count: 5,
            locations: [],
          },
          {
            feature: { name: 'nullish-coalescing', description: 'Nullish coalescing' },
            count: 3,
            locations: [],
          },
          {
            feature: { name: 'private-fields', description: 'Private fields' },
            count: 2,
            locations: [],
          },
        ],
        totalFeatures: 3,
        modernFeatureUsage: 0.8,
        compatibilityScore: 0.9,
      };

      const config = support.generateBabelConfig(featureDetection);

      expect(config.presets).toBeDefined();
      expect(config.plugins).toBeDefined();
      expect(config.presets[0][0]).toBe('@babel/preset-env');
      expect(config.plugins).toContain('@babel/plugin-proposal-optional-chaining');
      expect(config.plugins).toContain('@babel/plugin-proposal-nullish-coalescing-operator');
    });

    it('should add TypeScript preset when TypeScript is detected', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'typescript', description: 'TypeScript' },
            count: 10,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.5,
        compatibilityScore: 0.9,
      };

      const config = support.generateBabelConfig(featureDetection);

      expect(config.presets.some(preset => 
        Array.isArray(preset) && preset[0] === '@babel/preset-typescript'
      )).toBe(true);
    });

    it('should add React preset when JSX is detected', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'jsx', description: 'JSX' },
            count: 5,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.6,
        compatibilityScore: 0.9,
      };

      const config = support.generateBabelConfig(featureDetection);

      expect(config.presets.some(preset => 
        Array.isArray(preset) && preset[0] === '@babel/preset-react'
      )).toBe(true);
    });

    it('should add decorators plugin when decorators are detected', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'decorators', description: 'Decorators' },
            count: 2,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.3,
        compatibilityScore: 0.8,
      };

      const config = support.generateBabelConfig(featureDetection);

      expect(config.plugins.some(plugin => 
        Array.isArray(plugin) && plugin[0] === '@babel/plugin-proposal-decorators'
      )).toBe(true);
    });
  });

  describe('testModernSyntaxCompilation', () => {
    it('should test SWC compilation of modern syntax', async () => {
      const code = 'const obj = { a: 1 }; console.log(obj?.b?.c);';
      const result = await support.testModernSyntaxCompilation(code, 'swc');

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.features).toContain('optional-chaining');
    });

    it('should test Babel compilation of modern syntax', async () => {
      const code = 'const obj = { a: 1 }; console.log(obj?.b?.c);';
      const result = await support.testModernSyntaxCompilation(code, 'babel');

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.features).toContain('optional-chaining');
    });

    it('should handle compilation errors gracefully', async () => {
      // Mock detector to throw an error
      const mockDetector = {
        detectFeaturesInCode: vi.fn().mockRejectedValue(new Error('Syntax error')),
      };

      vi.doMock('../../features/detector.js', () => ({
        ModernFeaturesDetector: vi.fn(() => mockDetector),
      }));

      const errorSupport = new ModernFeaturesCompilerSupport(mockConfig);
      const code = 'invalid syntax here';
      const result = await errorSupport.testModernSyntaxCompilation(code);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.features).toHaveLength(0);
    });
  });

  describe('generateFeatureSupportDocs', () => {
    it('should generate comprehensive feature support documentation', () => {
      const featureSupport = {
        swc: {
          jsc: {
            target: 'es2022',
            parser: {
              syntax: 'ecmascript' as const,
              jsx: true,
              privateMethod: true,
            },
            transform: {
              react: {
                runtime: 'automatic' as const,
              },
            },
          },
          minify: true,
        },
        babel: {
          presets: [['@babel/preset-env', {}]],
          plugins: ['@babel/plugin-proposal-optional-chaining'],
        },
        supportedFeatures: ['optional-chaining', 'arrow-functions'],
        unsupportedFeatures: ['private-fields', 'top-level-await'],
        recommendations: ['Enable polyfills for unsupported features'],
        warnings: ['Experimental features detected'],
      };

      const docs = support.generateFeatureSupportDocs(featureSupport);

      expect(docs).toContain('# Modern JavaScript Features Support');
      expect(docs).toContain('## Supported Features');
      expect(docs).toContain('✅ optional-chaining');
      expect(docs).toContain('## Unsupported Features');
      expect(docs).toContain('❌ private-fields');
      expect(docs).toContain('## Recommendations');
      expect(docs).toContain('💡 Enable polyfills');
      expect(docs).toContain('## Warnings');
      expect(docs).toContain('⚠️ Experimental features');
      expect(docs).toContain('## SWC Configuration');
      expect(docs).toContain('## Babel Configuration');
    });
  });
});

describe('Factory Functions', () => {
  const mockConfig: Partial<ModernBalmConfig> = {
    features: {
      hmr: true,
      splitting: true,
      treeshaking: true,
      minification: true,
      sourceMap: true,
      cssExtraction: true,
      polyfillInjection: true,
      modernSyntax: true,
    },
  };

  describe('createModernFeaturesCompilerSupport', () => {
    it('should create ModernFeaturesCompilerSupport instance', () => {
      const support = createModernFeaturesCompilerSupport(mockConfig);
      expect(support).toBeInstanceOf(ModernFeaturesCompilerSupport);
    });

    it('should accept custom features configuration', () => {
      const featuresConfig = { enabled: false, target: 'es2021' };
      const support = createModernFeaturesCompilerSupport(mockConfig, featuresConfig);
      expect(support).toBeInstanceOf(ModernFeaturesCompilerSupport);
    });
  });

  describe('generateModernFeaturesCompilerConfigs', () => {
    it('should generate compiler configurations for a project', async () => {
      const result = await generateModernFeaturesCompilerConfigs(mockConfig);
      
      expect(result).toBeDefined();
      expect(result.swc).toBeDefined();
      expect(result.babel).toBeDefined();
      expect(result.supportedFeatures).toBeDefined();
      expect(result.unsupportedFeatures).toBeDefined();
    });

    it('should accept custom project path', async () => {
      const customPath = '/custom/path';
      const result = await generateModernFeaturesCompilerConfigs(mockConfig, customPath);
      
      expect(result).toBeDefined();
    });

    it('should accept custom features configuration', async () => {
      const featuresConfig = { target: 'es2021', loose: true };
      const result = await generateModernFeaturesCompilerConfigs(
        mockConfig, 
        process.cwd(), 
        featuresConfig
      );
      
      expect(result).toBeDefined();
    });
  });

  describe('testModernSyntax', () => {
    it('should test modern syntax compilation', async () => {
      const code = 'const x = obj?.prop ?? "default";';
      const result = await testModernSyntax(code, mockConfig);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.features).toBeDefined();
    });

    it('should accept custom compiler choice', async () => {
      const code = 'const x = obj?.prop;';
      const result = await testModernSyntax(code, mockConfig, 'babel');
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should accept custom features configuration', async () => {
      const code = 'const x = obj?.prop;';
      const featuresConfig = { target: 'es2021' };
      const result = await testModernSyntax(code, mockConfig, 'swc', featuresConfig);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complex modern features scenarios', async () => {
    const complexConfig: Partial<ModernBalmConfig> = {
      features: {
        hmr: true,
        splitting: true,
        treeshaking: true,
        minification: true,
        sourceMap: true,
        cssExtraction: true,
        polyfillInjection: true,
        modernSyntax: true,
      },
    };

    const featuresConfig = {
      enabled: true,
      target: 'es2022',
      loose: false,
      useBuiltIns: 'usage' as const,
      corejs: { version: '3.32', proposals: true },
    };

    const support = createModernFeaturesCompilerSupport(complexConfig, featuresConfig);
    const result = await support.generateCompilerConfigs();

    expect(result).toBeDefined();
    expect(result.swc).toBeDefined();
    expect(result.babel).toBeDefined();
    
    // Test documentation generation
    const docs = support.generateFeatureSupportDocs(result);
    expect(docs).toContain('Modern JavaScript Features Support');
  });

  it('should generate consistent configurations across compilers', async () => {
    const config: Partial<ModernBalmConfig> = {
      features: {
        hmr: true,
        splitting: true,
        treeshaking: true,
        minification: false,
        sourceMap: true,
        cssExtraction: true,
        polyfillInjection: true,
        modernSyntax: true,
      },
    };

    const result = await generateModernFeaturesCompilerConfigs(config);

    // Both compilers should have similar target configurations
    expect(result.swc.jsc.target).toBeDefined();
    expect(result.babel.presets[0]).toContain('@babel/preset-env');
    
    // Both should handle the same set of features
    const totalFeatures = result.supportedFeatures.length + result.unsupportedFeatures.length;
    expect(totalFeatures).toBeGreaterThan(0);
  });
});