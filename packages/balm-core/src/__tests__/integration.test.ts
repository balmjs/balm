/**
 * Integration tests for BalmJS modernization
 * Tests end-to-end functionality and component integration
 */

import { 
  validateConfig, 
  migrateConfig, 
  needsMigration 
} from '../config/index.js';
import { 
  ErrorHandler, 
  createConfigError, 
  formatErrorForConsole,
  SuggestionEngine 
} from '../errors/index.js';
import { ModernBalmConfig } from '../config/types.js';

describe('Integration Tests', () => {
  describe('Configuration System Integration', () => {
    it('should integrate validation and migration', () => {
      // Legacy configuration
      const legacyConfig = {
        env: 'production',
        roots: {
          source: 'app',
          target: 'build',
        },
        server: {
          port: 8080,
          localOnly: false,
        },
        scripts: {
          babel: true,
          typescript: true,
        },
      };

      // Check if migration is needed
      expect(needsMigration(legacyConfig)).toBe(true);

      // Migrate configuration
      const migrationResult = migrateConfig(legacyConfig);
      expect(migrationResult.success).toBe(true);

      // Validate migrated configuration
      const validationResult = validateConfig(migrationResult.config);
      expect(validationResult.valid).toBe(true);

      // Check final configuration structure
      const config = validationResult.config!;
      expect(config.mode).toBe('production');
      expect(config.paths.src).toBe('app');
      expect(config.paths.dist).toBe('build');
      expect(config.devServer.port).toBe(8080);
      expect(config.devServer.host).toBe('0.0.0.0');
      expect(config.compiler.primary).toBe('babel');
      expect(config.compiler.typescript).toBe(true);
    });

    it('should handle invalid legacy configuration gracefully', () => {
      const invalidLegacyConfig = {
        env: 'invalid-mode',
        roots: {
          source: 123, // Invalid type
        },
        server: {
          port: 'not-a-number', // Invalid type
        },
      };

      // Migration should succeed (it normalizes what it can)
      const migrationResult = migrateConfig(invalidLegacyConfig);
      expect(migrationResult.success).toBe(true);

      // But validation should catch the remaining issues
      const validationResult = validateConfig(migrationResult.config);
      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling Integration', () => {
    it('should integrate error handling with configuration validation', () => {
      const errorHandler = new ErrorHandler({
        logToConsole: false,
        collectErrors: true,
      });

      const invalidConfig = {
        mode: 'invalid-mode',
        bundler: 'invalid-bundler',
        paths: {
          src: 123,
        },
      };

      const validationResult = validateConfig(invalidConfig);
      expect(validationResult.valid).toBe(false);

      // Create configuration errors from validation results
      validationResult.errors.forEach(error => {
        const configError = createConfigError('CONFIG-VALUE-001', {
          property: error.path,
          value: error.value,
          expected: 'valid value',
        }, {
          config: invalidConfig,
        });

        errorHandler.handleError(configError);
      });

      // Check that errors were collected
      const summary = errorHandler.getSummary();
      expect(summary.total).toBe(validationResult.errors.length);
      expect(summary.errors).toBeGreaterThan(0);

      // Test error formatting
      const errors = errorHandler.getErrors();
      errors.forEach(error => {
        const formatted = formatErrorForConsole(error, { colors: false });
        expect(formatted).toContain('[CONFIG-VALUE-001]');
        expect(formatted).toContain('Invalid value for configuration property');
      });
    });

    it('should integrate error handling with suggestion engine', async () => {
      const suggestionEngine = new SuggestionEngine();
      
      // Create a configuration error
      const configError = createConfigError('CONFIG-SYNTAX-001', {
        file: 'balm.config.js',
      }, {
        config: { mode: 'invalid' },
        configPath: '/project/balm.config.js',
      });

      // Generate suggestions
      const suggestions = await suggestionEngine.suggest(configError);

      expect(suggestions.suggestions.length).toBeGreaterThan(0);
      expect(suggestions.appliedRules.length).toBeGreaterThan(0);
      expect(suggestions.suggestions.some(s => s.includes('configuration'))).toBe(true);
    });
  });

  describe('End-to-End Configuration Flow', () => {
    it('should handle complete configuration lifecycle', () => {
      // Start with a legacy configuration
      const legacyConfig = {
        production: true,
        roots: {
          source: 'src',
          target: 'dist',
        },
        server: {
          port: 3000,
          open: true,
        },
        scripts: {
          babel: false, // Use SWC
          typescript: true,
        },
        styles: {
          sass: true,
        },
        // Deprecated options
        useDefault: true,
        legacy: false,
      };

      // Step 1: Check if migration is needed
      expect(needsMigration(legacyConfig)).toBe(true);

      // Step 2: Migrate configuration
      const migrationResult = migrateConfig(legacyConfig);
      expect(migrationResult.success).toBe(true);
      expect(migrationResult.changes.length).toBeGreaterThan(0);

      // Step 3: Validate migrated configuration
      const validationResult = validateConfig(migrationResult.config);
      expect(validationResult.valid).toBe(true);

      // Step 4: Verify final configuration
      const finalConfig = validationResult.config!;
      expect(finalConfig.mode).toBe('production');
      expect(finalConfig.bundler).toBe('webpack'); // Default added
      expect(finalConfig.paths.src).toBe('src');
      expect(finalConfig.paths.dist).toBe('dist');
      expect(finalConfig.devServer.port).toBe(3000);
      expect(finalConfig.devServer.open).toBe(true);
      expect(finalConfig.compiler.primary).toBe('swc'); // babel: false -> swc
      expect(finalConfig.compiler.typescript).toBe(true);

      // Step 5: Verify deprecated options were removed
      expect(finalConfig).not.toHaveProperty('useDefault');
      expect(finalConfig).not.toHaveProperty('legacy');
      expect(finalConfig).not.toHaveProperty('production');
      expect(finalConfig).not.toHaveProperty('roots');
      expect(finalConfig).not.toHaveProperty('server');
      expect(finalConfig).not.toHaveProperty('scripts');
      expect(finalConfig).not.toHaveProperty('styles');
    });

    it('should handle modern configuration without changes', () => {
      const modernConfig: ModernBalmConfig = {
        mode: 'development',
        bundler: 'vite',
        paths: {
          src: 'source',
          dist: 'output',
          public: 'static',
          assets: 'media',
        },
        devServer: {
          host: '0.0.0.0',
          port: 4000,
          open: false,
          https: true,
        },
        compiler: {
          primary: 'swc',
          target: 'es2022',
          jsx: true,
          typescript: true,
        },
      };

      // Should not need migration
      expect(needsMigration(modernConfig)).toBe(false);

      // Migration should succeed with no changes
      const migrationResult = migrateConfig(modernConfig);
      expect(migrationResult.success).toBe(true);
      expect(migrationResult.changes.length).toBe(0);

      // Validation should pass
      const validationResult = validateConfig(migrationResult.config);
      expect(validationResult.valid).toBe(true);

      // Configuration should remain unchanged
      expect(validationResult.config).toEqual(expect.objectContaining(modernConfig));
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from partial configuration errors', () => {
      const partiallyInvalidConfig = {
        mode: 'development', // Valid
        bundler: 'invalid-bundler', // Invalid
        paths: {
          src: 'src', // Valid
          dist: 123, // Invalid
        },
        devServer: {
          port: 3000, // Valid
          host: null, // Invalid
        },
      };

      const validationResult = validateConfig(partiallyInvalidConfig);
      expect(validationResult.valid).toBe(false);

      // Should still provide a normalized config with valid parts
      expect(validationResult.config).toBeDefined();
      expect(validationResult.config!.mode).toBe('development');
      expect(validationResult.config!.paths.src).toBe('src');
      expect(validationResult.config!.devServer.port).toBe(3000);

      // Invalid parts should have defaults
      expect(validationResult.config!.bundler).toBe('webpack'); // Default
      expect(validationResult.config!.paths.dist).toBe('dist'); // Default
      expect(validationResult.config!.devServer.host).toBe('localhost'); // Default
    });

    it('should handle completely invalid configuration', () => {
      const invalidConfigs = [
        null,
        undefined,
        'not-an-object',
        123,
        [],
        { completely: 'invalid', structure: true },
      ];

      invalidConfigs.forEach(config => {
        const validationResult = validateConfig(config);
        expect(validationResult.valid).toBe(false);
        
        // Should still provide some form of configuration or clear error
        if (validationResult.config) {
          // If config is provided, it should have basic structure
          expect(validationResult.config.mode).toBeDefined();
          expect(validationResult.config.bundler).toBeDefined();
        } else {
          // If no config, should have clear errors
          expect(validationResult.errors.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large configurations efficiently', () => {
      // Create a large configuration with many properties
      const largeConfig = {
        mode: 'production',
        bundler: 'webpack',
        paths: {
          src: 'src',
          dist: 'dist',
          public: 'public',
          assets: 'assets',
        },
        devServer: {
          host: 'localhost',
          port: 3000,
          open: true,
          https: false,
          proxy: {},
        },
        compiler: {
          primary: 'babel',
          target: 'es2020',
          jsx: true,
          typescript: true,
        },
      };

      // Add many proxy rules to make it larger
      for (let i = 0; i < 100; i++) {
        largeConfig.devServer.proxy[`/api${i}`] = `http://localhost:${3001 + i}`;
      }

      const startTime = Date.now();
      const validationResult = validateConfig(largeConfig);
      const endTime = Date.now();

      expect(validationResult.valid).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    it('should handle multiple rapid validations', () => {
      const configs = Array.from({ length: 50 }, (_, i) => ({
        mode: i % 2 === 0 ? 'development' : 'production',
        bundler: i % 3 === 0 ? 'webpack' : i % 3 === 1 ? 'vite' : 'rollup',
        paths: {
          src: `src${i}`,
          dist: `dist${i}`,
        },
        devServer: {
          port: 3000 + i,
        },
      }));

      const startTime = Date.now();
      const results = configs.map(config => validateConfig(config));
      const endTime = Date.now();

      expect(results.every(r => r.valid)).toBe(true);
      expect(endTime - startTime).toBeLessThan(500); // Should handle batch efficiently
    });
  });
});