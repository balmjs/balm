/**
 * Tests for configuration migrator
 */

import { ConfigMigrator, migrateConfig, needsMigration, previewMigration } from '../migrator.js';

describe('ConfigMigrator', () => {
  let migrator: ConfigMigrator;

  beforeEach(() => {
    migrator = new ConfigMigrator();
  });

  describe('migrate', () => {
    it('should migrate legacy env property to mode', () => {
      const legacyConfig = {
        env: 'production',
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'env')).toBe(true);
    });

    it('should migrate legacy production boolean to mode', () => {
      const legacyConfig = {
        production: true,
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.changes.some(c => c.type === 'modified' && c.path === 'production')).toBe(true);
    });

    it('should migrate legacy roots to paths', () => {
      const legacyConfig = {
        roots: {
          source: 'app',
          target: 'build',
        },
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.paths.src).toBe('app');
      expect(result.config.paths.dist).toBe('build');
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'roots')).toBe(true);
    });

    it('should migrate legacy server to devServer', () => {
      const legacyConfig = {
        server: {
          localOnly: true,
          port: 8080,
          open: false,
          proxyTable: {
            '/api': 'http://localhost:3000',
          },
        },
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.devServer.host).toBe('localhost');
      expect(result.config.devServer.port).toBe(8080);
      expect(result.config.devServer.open).toBe(false);
      expect(result.config.devServer.proxy).toEqual({
        '/api': 'http://localhost:3000',
      });
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'server')).toBe(true);
    });

    it('should migrate legacy scripts to compiler', () => {
      const legacyConfig = {
        scripts: {
          babel: false,
          typescript: true,
          target: 'es2018',
        },
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.compiler.primary).toBe('swc'); // babel: false -> swc
      expect(result.config.compiler.typescript).toBe(true);
      expect(result.config.compiler.target).toBe('es2018');
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'scripts')).toBe(true);
    });

    it('should migrate legacy styles to css', () => {
      const legacyConfig = {
        styles: {
          sass: true,
          postcss: ['autoprefixer'],
        },
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.changes.some(c => c.type === 'renamed' && c.path === 'styles')).toBe(true);
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

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config).not.toHaveProperty('useDefault');
      expect(result.config).not.toHaveProperty('legacy');
      expect(result.config).not.toHaveProperty('modernizr');
      expect(result.changes.filter(c => c.type === 'removed')).toHaveLength(6);
    });

    it('should add default values for new options', () => {
      const legacyConfig = {
        env: 'development',
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.bundler).toBe('webpack');
      expect(result.changes.some(c => c.type === 'added' && c.path === 'bundler')).toBe(true);
    });

    it('should preserve backup of original configuration', () => {
      const legacyConfig = {
        env: 'production',
        roots: { source: 'src' },
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.backup).toEqual(legacyConfig);
      expect(result.backup).not.toBe(legacyConfig); // Should be a copy
    });

    it('should handle complex nested migration', () => {
      const legacyConfig = {
        production: true,
        roots: {
          source: 'app',
          target: 'dist',
          assets: 'static',
        },
        server: {
          localOnly: false,
          port: 9000,
          https: true,
          proxyTable: {
            '/api': 'https://api.example.com',
            '/auth': 'https://auth.example.com',
          },
        },
        scripts: {
          babel: true,
          typescript: false,
          target: 'es2020',
        },
        styles: {
          sass: true,
          postcss: true,
        },
        useDefault: false,
        legacy: true,
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production');
      expect(result.config.paths.src).toBe('app');
      expect(result.config.paths.dist).toBe('dist');
      expect(result.config.paths.assets).toBe('static');
      expect(result.config.devServer.host).toBe('0.0.0.0');
      expect(result.config.devServer.port).toBe(9000);
      expect(result.config.devServer.https).toBe(true);
      expect(result.config.compiler.primary).toBe('babel');
      expect(result.config.compiler.typescript).toBe(false);
      expect(result.config.compiler.target).toBe('es2020');
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it('should handle migration errors gracefully', () => {
      const invalidConfig = null;

      const result = migrator.migrate(invalidConfig);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.config).toBeDefined(); // Should return default config
    });
  });

  describe('utility functions', () => {
    it('should migrate using utility function', () => {
      const legacyConfig = { env: 'development' };
      const result = migrateConfig(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('development');
    });

    it('should detect if migration is needed', () => {
      const legacyConfig = { env: 'development', roots: {} };
      const modernConfig = { mode: 'development', paths: {} };

      expect(needsMigration(legacyConfig)).toBe(true);
      expect(needsMigration(modernConfig)).toBe(false);
    });

    it('should preview migration changes', () => {
      const legacyConfig = { env: 'production', roots: { source: 'src' } };
      const changes = previewMigration(legacyConfig);

      expect(changes.length).toBeGreaterThan(0);
      expect(changes.some(c => c.path === 'env')).toBe(true);
      expect(changes.some(c => c.path === 'roots')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty configuration', () => {
      const result = migrator.migrate({});

      expect(result.success).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.changes.some(c => c.type === 'added')).toBe(true);
    });

    it('should handle configuration with only modern properties', () => {
      const modernConfig = {
        mode: 'development',
        bundler: 'vite',
        paths: { src: 'src', dist: 'dist' },
      };

      const result = migrator.migrate(modernConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('development');
      expect(result.config.bundler).toBe('vite');
    });

    it('should handle mixed legacy and modern properties', () => {
      const mixedConfig = {
        mode: 'production', // Modern
        env: 'development', // Legacy (should be ignored since mode exists)
        bundler: 'webpack', // Modern
        roots: { source: 'app' }, // Legacy
        paths: { dist: 'build' }, // Modern (should merge with migrated roots)
      };

      const result = migrator.migrate(mixedConfig);

      expect(result.success).toBe(true);
      expect(result.config.mode).toBe('production'); // Modern takes precedence
      expect(result.config.paths.src).toBe('app'); // From migrated roots
      expect(result.config.paths.dist).toBe('build'); // From modern paths
    });
  });

  describe('custom rules', () => {
    it('should allow adding custom migration rules', () => {
      const customRule = {
        name: 'custom-rule',
        description: 'Custom migration rule',
        version: '1.0.0',
        apply: (config: any) => {
          if (config.customLegacy) {
            config.customModern = config.customLegacy;
            delete config.customLegacy;
            return [{
              type: 'renamed' as const,
              path: 'customLegacy',
              oldValue: config.customLegacy,
              newValue: config.customModern,
              reason: 'Custom legacy property renamed',
            }];
          }
          return [];
        },
      };

      migrator.addRule(customRule);

      const legacyConfig = {
        customLegacy: 'test-value',
      };

      const result = migrator.migrate(legacyConfig);

      expect(result.success).toBe(true);
      expect(result.changes.some(c => c.path === 'customLegacy')).toBe(true);
    });
  });
});