/**
 * Compatibility tests for BalmJS modernization
 * Tests backward compatibility and migration scenarios
 */

import { migrateConfig, needsMigration } from '../config/migrator.js';
import { validateConfig } from '../config/validator.js';
import { ModernBalmConfig } from '../config/types.js';

describe('Compatibility Tests', () => {
  describe('Legacy Configuration Migration', () => {
    it('should migrate legacy env property to mode', () => {
      const legacyConfig = {
        env: 'production',
        roots: {
          source: 'src',
          target: 'build',
        },
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'env')).toBe(true);
    });

    it('should migrate legacy production boolean to mode', () => {
      const legacyConfig = {
        production: true,
        roots: {
          source: 'app',
          target: 'dist',
        },
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.changes.some(c => c.type === 'modified' && c.path === 'production')).toBe(true);
    });

    it('should migrate legacy roots to paths', () => {
      const legacyConfig = {
        roots: {
          source: 'app',
          target: 'build',
          assets: 'static',
        },
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.paths?.src).toBe('app');
      expect(result.config.paths?.dist).toBe('build');
      expect(result.config.paths?.assets).toBe('static');
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'roots')).toBe(true);
    });

    it('should migrate legacy server to devServer', () => {
      const legacyConfig = {
        server: {
          localOnly: true,
          port: 8080,
          open: false,
          https: true,
          proxyTable: {
            '/api': 'http://localhost:3000',
          },
        },
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.devServer?.host).toBe('localhost');
      expect(result.config.devServer?.port).toBe(8080);
      expect(result.config.devServer?.open).toBe(false);
      expect(result.config.devServer?.https).toBe(true);
      expect(result.config.devServer?.proxy).toEqual({
        '/api': 'http://localhost:3000',
      });
    });

    it('should migrate legacy scripts to compiler', () => {
      const legacyConfig = {
        scripts: {
          babel: true,
          typescript: true,
          target: 'es2018',
        },
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.compiler?.primary).toBe('babel');
      expect(result.config.compiler?.typescript).toBe(true);
      expect(result.config.compiler?.target).toBe('es2018');
    });

    it('should migrate legacy styles to css', () => {
      const legacyConfig = {
        styles: {
          sass: true,
          postcss: true,
        },
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.css).toEqual({
        sass: true,
        postcss: true,
      });
    });

    it('should remove deprecated options', () => {
      const legacyConfig = {
        useDefault: true,
        legacy: false,
        modernizr: {},
        sprites: {},
        zip: {},
        ftp: {},
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config).not.toHaveProperty('useDefault');
      expect(result.config).not.toHaveProperty('legacy');
      expect(result.config).not.toHaveProperty('modernizr');
      expect(result.config).not.toHaveProperty('sprites');
      expect(result.config).not.toHaveProperty('zip');
      expect(result.config).not.toHaveProperty('ftp');
      
      const removedChanges = result.changes.filter(c => c.type === 'removed');
      expect(removedChanges.length).toBeGreaterThan(0);
    });

    it('should add default values for new options', () => {
      const legacyConfig = {
        env: 'development',
      };

      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.bundler).toBe('webpack');
      expect(result.changes.some(c => c.type === 'added' && c.path === 'bundler')).toBe(true);
    });

    it('should preserve existing modern configuration', () => {
      const modernConfig: ModernBalmConfig = {
        mode: 'production',
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

      const result = migrateConfig(modernConfig);

      expect(result.success).toBe(true);
      expect(result.config).toEqual(expect.objectContaining(modernConfig));
      expect(result.changes.length).toBe(0); // No changes needed
    });
  });

  describe('Migration Detection', () => {
    it('should detect legacy configurations that need migration', () => {
      const legacyConfigs = [
        { env: 'production' },
        { production: true },
        { roots: { source: 'src' } },
        { server: { port: 3000 } },
        { scripts: { babel: true } },
        { styles: { sass: true } },
        { useDefault: true },
        { legacy: false },
      ];

      legacyConfigs.forEach(config => {
        expect(needsMigration(config)).toBe(true);
      });
    });

    it('should not detect modern configurations as needing migration', () => {
      const modernConfigs = [
        { mode: 'production' },
        { bundler: 'webpack' },
        { paths: { src: 'src' } },
        { devServer: { port: 3000 } },
        { compiler: { primary: 'babel' } },
        { css: { sass: true } },
      ];

      modernConfigs.forEach(config => {
        expect(needsMigration(config)).toBe(false);
      });
    });
  });

  describe('Configuration Validation Compatibility', () => {
    it('should validate migrated configurations', () => {
      const legacyConfig = {
        env: 'production',
        roots: {
          source: 'app',
          target: 'build',
        },
        server: {
          port: 8080,
          open: true,
        },
        scripts: {
          babel: true,
          target: 'es2020',
        },
      };

      const migrationResult = migrateConfig(legacyConfig);
      expect(migrationResult.success).toBe(true);

      const validationResult = validateConfig(migrationResult.config);
      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors.length).toBe(0);
    });

    it('should handle invalid legacy configurations gracefully', () => {
      const invalidLegacyConfig = {
        env: 'invalid-mode',
        roots: {
          source: 123, // Invalid type
        },
        server: {
          port: 'invalid-port', // Invalid type
        },
      };

      const migrationResult = migrateConfig(invalidLegacyConfig);
      expect(migrationResult.success).toBe(true); // Migration succeeds

      const validationResult = validateConfig(migrationResult.config);
      expect(validationResult.valid).toBe(false); // But validation fails
      expect(validationResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('API Backward Compatibility', () => {
    it('should maintain compatibility with legacy API patterns', () => {
      // Test that old API patterns still work or provide clear migration paths
      const legacyApiUsage = {
        // Legacy boolean flags
        production: true,
        // Legacy nested structure
        roots: {
          source: 'src',
          target: 'dist',
        },
        // Legacy server config
        server: {
          localOnly: false,
          port: 3000,
        },
      };

      const result = migrateConfig(legacyApiUsage);
      
      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.config.paths?.src).toBe('src');
      expect(result.config.paths?.dist).toBe('dist');
      expect(result.config.devServer?.host).toBe('0.0.0.0');
      expect(result.config.devServer?.port).toBe(3000);
    });

    it('should provide clear error messages for unsupported legacy features', () => {
      const unsupportedConfig = {
        // Features that are no longer supported
        modernizr: {
          enabled: true,
        },
        sprites: {
          enabled: true,
        },
      };

      const result = migrateConfig(unsupportedConfig);
      
      expect(result.success).toBe(true);
      expect(result.warnings.length).toBe(0); // These should be removed, not warned about
      
      const removedFeatures = result.changes.filter(c => c.type === 'removed');
      expect(removedFeatures.length).toBeGreaterThan(0);
      
      removedFeatures.forEach(change => {
        expect(change.reason).toContain('Deprecated');
      });
    });
  });

  describe('Node.js Version Compatibility', () => {
    it('should work with supported Node.js versions', () => {
      // Test that the configuration system works with different Node.js versions
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      // BalmJS should support Node.js 14+
      expect(majorVersion).toBeGreaterThanOrEqual(14);
      
      // Test basic functionality
      const config = {
        mode: 'development' as const,
        bundler: 'webpack' as const,
      };
      
      const result = validateConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe('Complex Migration Scenarios', () => {
    it('should handle complex legacy configurations', () => {
      const complexLegacyConfig = {
        production: false,
        env: 'development', // Should prefer env over production
        roots: {
          source: 'app/src',
          target: 'public/dist',
          assets: 'app/assets',
        },
        server: {
          localOnly: false,
          port: 8080,
          open: true,
          https: false,
          proxyTable: {
            '/api': 'http://localhost:3001',
            '/auth': 'http://localhost:3002',
          },
        },
        scripts: {
          babel: false, // Should use SWC
          typescript: true,
          target: 'es2019',
        },
        styles: {
          sass: true,
          postcss: true,
          extract: true,
        },
        // Deprecated features
        useDefault: true,
        legacy: false,
        modernizr: {
          enabled: false,
        },
      };

      const result = migrateConfig(complexLegacyConfig);

      expect(result.success).toBe(true);
      
      // Check migrated values
      expect(result.config.mode).toBe('development'); // env takes precedence
      expect(result.config.paths?.src).toBe('app/src');
      expect(result.config.paths?.dist).toBe('public/dist');
      expect(result.config.paths?.assets).toBe('app/assets');
      
      expect(result.config.devServer?.host).toBe('0.0.0.0'); // localOnly: false
      expect(result.config.devServer?.port).toBe(8080);
      expect(result.config.devServer?.open).toBe(true);
      expect(result.config.devServer?.https).toBe(false);
      expect(result.config.devServer?.proxy).toEqual({
        '/api': 'http://localhost:3001',
        '/auth': 'http://localhost:3002',
      });
      
      expect(result.config.compiler?.primary).toBe('swc'); // babel: false
      expect(result.config.compiler?.typescript).toBe(true);
      expect(result.config.compiler?.target).toBe('es2019');
      
      expect(result.config.css).toEqual({
        sass: true,
        postcss: true,
        extract: true,
      });
      
      // Check that deprecated features were removed
      expect(result.config).not.toHaveProperty('useDefault');
      expect(result.config).not.toHaveProperty('legacy');
      expect(result.config).not.toHaveProperty('modernizr');
      
      // Validate the final configuration
      const validationResult = validateConfig(result.config);
      expect(validationResult.valid).toBe(true);
    });
  });
});