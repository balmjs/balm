/**
 * Tests for Polyfill Injector
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import { PolyfillInjector, createPolyfillInjector, analyzePolyfillRequirements } from '../polyfill-injector.js';
import { ModernBalmConfig } from '../../config/modern.js';

// Mock dependencies
vi.mock('node:fs');
vi.mock('../detector.js');
vi.mock('../target-resolver.js');

const mockFs = vi.mocked(fs);

describe('PolyfillInjector', () => {
  let injector: PolyfillInjector;
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
        ],
        totalFeatures: 2,
        modernFeatureUsage: 0.8,
        compatibilityScore: 0.9,
      }),
    };

    // Mock target resolver
    const mockTargetResolver = {
      resolveTargetEnvironment: vi.fn().mockReturnValue({
        browsers: ['chrome >= 90', 'firefox >= 88'],
        supportedFeatures: ['arrow-functions', 'const-let'],
        polyfillsNeeded: ['optional-chaining', 'nullish-coalescing'],
        nodeVersion: '16.0.0',
      }),
      generateBrowserslistConfig: vi.fn().mockReturnValue(['chrome >= 90', 'firefox >= 88']),
    };

    vi.doMock('../detector.js', () => ({
      ModernFeaturesDetector: vi.fn(() => mockDetector),
    }));

    vi.doMock('../target-resolver.js', () => ({
      TargetConfigResolver: vi.fn(() => mockTargetResolver),
    }));

    injector = new PolyfillInjector(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      const defaultInjector = new PolyfillInjector({});
      expect(defaultInjector).toBeInstanceOf(PolyfillInjector);
    });

    it('should merge custom polyfill configuration', () => {
      const customConfig = {
        enabled: false,
        mode: 'entry' as const,
        debug: true,
      };
      
      const customInjector = new PolyfillInjector(mockConfig, customConfig);
      expect(customInjector).toBeInstanceOf(PolyfillInjector);
    });
  });

  describe('injectPolyfills', () => {
    it('should return empty result when disabled', async () => {
      const disabledInjector = new PolyfillInjector(mockConfig, { enabled: false });
      const result = await disabledInjector.injectPolyfills();

      expect(result.polyfillsAdded).toHaveLength(0);
      expect(result.totalSize).toBe(0);
      expect(result.optimizations).toContain('Polyfill injection disabled');
    });

    it('should analyze and inject required polyfills', async () => {
      const result = await injector.injectPolyfills();

      expect(result.polyfillsAdded.length).toBeGreaterThan(0);
      expect(result.totalSize).toBeGreaterThan(0);
      expect(result.optimizations).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should handle project path parameter', async () => {
      const customPath = '/custom/project/path';
      const result = await injector.injectPolyfills(customPath);

      expect(result).toBeDefined();
      expect(result.polyfillsAdded).toBeDefined();
    });
  });

  describe('generateBundlerConfig', () => {
    it('should generate Babel configuration', () => {
      const config = injector.generateBundlerConfig();

      expect(config.babel).toBeDefined();
      expect(config.babel.presets).toBeDefined();
      expect(config.babel.presets[0][0]).toBe('@babel/preset-env');
    });

    it('should generate SWC configuration', () => {
      const config = injector.generateBundlerConfig();

      expect(config.swc).toBeDefined();
      expect(config.swc.env).toBeDefined();
      expect(config.swc.env.targets).toBeDefined();
    });

    it('should generate Vite configuration when polyfill injection is enabled', () => {
      const config = injector.generateBundlerConfig();

      expect(config.vite).toBeDefined();
      expect(config.vite.legacy).toBeDefined();
    });

    it('should not generate Vite legacy config when polyfill injection is disabled', () => {
      const disabledConfig = { ...mockConfig };
      disabledConfig.features!.polyfillInjection = false;
      
      const disabledInjector = new PolyfillInjector(disabledConfig);
      const config = disabledInjector.generateBundlerConfig();

      expect(config.vite.legacy).toBeUndefined();
    });
  });

  describe('generatePolyfillImports', () => {
    it('should generate import statements for required polyfills', () => {
      const polyfills = [
        {
          name: 'optional-chaining',
          version: '3.32',
          size: 2500,
          features: ['optional-chaining'],
          required: true,
          source: 'core-js' as const,
          importPath: 'core-js/features/object/optional-chaining',
        },
        {
          name: 'nullish-coalescing',
          version: '3.32',
          size: 1800,
          features: ['nullish-coalescing'],
          required: true,
          source: 'core-js' as const,
          importPath: 'core-js/features/object/nullish-coalescing',
        },
      ];

      const imports = injector.generatePolyfillImports(polyfills);

      expect(imports).toHaveLength(2);
      expect(imports[0]).toBe("import 'core-js/features/object/optional-chaining';");
      expect(imports[1]).toBe("import 'core-js/features/object/nullish-coalescing';");
    });

    it('should skip non-required polyfills', () => {
      const polyfills = [
        {
          name: 'optional-chaining',
          version: '3.32',
          size: 2500,
          features: ['optional-chaining'],
          required: false,
          source: 'core-js' as const,
          importPath: 'core-js/features/object/optional-chaining',
        },
      ];

      const imports = injector.generatePolyfillImports(polyfills);

      expect(imports).toHaveLength(0);
    });
  });

  describe('createPolyfillEntry', () => {
    it('should create polyfill entry file with imports', async () => {
      const polyfills = [
        {
          name: 'optional-chaining',
          version: '3.32',
          size: 2500,
          features: ['optional-chaining'],
          required: true,
          source: 'core-js' as const,
          importPath: 'core-js/features/object/optional-chaining',
        },
      ];

      const outputPath = 'test-polyfills.js';
      await injector.createPolyfillEntry(polyfills, outputPath);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        outputPath,
        expect.stringContaining("import 'core-js/features/object/optional-chaining';"),
        'utf-8'
      );
    });

    it('should include polyfill information in generated file', async () => {
      const polyfills = [
        {
          name: 'test-polyfill',
          version: '1.0.0',
          size: 1000,
          features: ['test-feature'],
          required: true,
          source: 'core-js' as const,
          importPath: 'test-polyfill',
        },
      ];

      await injector.createPolyfillEntry(polyfills);

      const writeCall = mockFs.writeFileSync.mock.calls[0];
      const content = writeCall[1] as string;

      expect(content).toContain('export const polyfillInfo');
      expect(content).toContain('"name": "test-polyfill"');
      expect(content).toContain('"version": "1.0.0"');
      expect(content).toContain('"totalSize": 1000');
    });
  });

  describe('getRecommendations', () => {
    it('should provide recommendations based on feature detection and target environment', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'optional-chaining', description: 'Optional chaining' },
            count: 5,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.8,
        compatibilityScore: 0.9,
      };

      const targetEnvironment = {
        browsers: ['chrome >= 90'],
        supportedFeatures: ['arrow-functions'],
        polyfillsNeeded: ['optional-chaining'],
        nodeVersion: '16.0.0',
      };

      const recommendations = injector.getRecommendations(featureDetection, targetEnvironment);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });

    it('should recommend bundle size optimization for large polyfills', () => {
      const featureDetection = {
        featuresUsed: [
          {
            feature: { name: 'bigint', description: 'BigInt support' },
            count: 1,
            locations: [],
          },
        ],
        totalFeatures: 1,
        modernFeatureUsage: 0.5,
        compatibilityScore: 0.7,
      };

      const targetEnvironment = {
        browsers: ['chrome >= 60'],
        supportedFeatures: [],
        polyfillsNeeded: ['bigint'],
        nodeVersion: '14.0.0',
      };

      const recommendations = injector.getRecommendations(featureDetection, targetEnvironment);

      expect(recommendations.some(rec => 
        rec.includes('dynamic imports') || rec.includes('bundle size')
      )).toBe(true);
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

  describe('createPolyfillInjector', () => {
    it('should create PolyfillInjector instance', () => {
      const injector = createPolyfillInjector(mockConfig);
      expect(injector).toBeInstanceOf(PolyfillInjector);
    });

    it('should accept custom polyfill configuration', () => {
      const polyfillConfig = { enabled: false, debug: true };
      const injector = createPolyfillInjector(mockConfig, polyfillConfig);
      expect(injector).toBeInstanceOf(PolyfillInjector);
    });
  });

  describe('analyzePolyfillRequirements', () => {
    it('should analyze polyfill requirements for a project', async () => {
      const result = await analyzePolyfillRequirements(mockConfig);
      
      expect(result).toBeDefined();
      expect(result.polyfillsAdded).toBeDefined();
      expect(result.totalSize).toBeDefined();
      expect(result.optimizations).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should accept custom project path', async () => {
      const customPath = '/custom/path';
      const result = await analyzePolyfillRequirements(mockConfig, customPath);
      
      expect(result).toBeDefined();
    });

    it('should accept custom polyfill configuration', async () => {
      const polyfillConfig = { debug: true, mode: 'entry' as const };
      const result = await analyzePolyfillRequirements(mockConfig, process.cwd(), polyfillConfig);
      
      expect(result).toBeDefined();
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complex polyfill scenarios', async () => {
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

    const polyfillConfig = {
      enabled: true,
      mode: 'usage' as const,
      corejs: { version: '3.32', proposals: true },
      debug: true,
    };

    const injector = createPolyfillInjector(complexConfig, polyfillConfig);
    const result = await injector.injectPolyfills();

    expect(result).toBeDefined();
    expect(result.polyfillsAdded).toBeDefined();
    
    // Test bundler config generation
    const bundlerConfig = injector.generateBundlerConfig();
    expect(bundlerConfig.babel).toBeDefined();
    expect(bundlerConfig.swc).toBeDefined();
    expect(bundlerConfig.vite).toBeDefined();
  });

  it('should optimize polyfill selection', async () => {
    const injector = createPolyfillInjector({
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
    });

    const result = await injector.injectPolyfills();

    // Should not have duplicate polyfills
    const importPaths = result.polyfillsAdded.map(p => p.importPath);
    const uniquePaths = [...new Set(importPaths)];
    expect(importPaths.length).toBe(uniquePaths.length);
  });
});