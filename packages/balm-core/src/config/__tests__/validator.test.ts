/**
 * Tests for configuration validator
 */

import { ConfigValidator, validateConfig, isValidConfig, normalizeConfig } from '../validator.js';
import { ModernBalmConfig } from '../types.js';

describe('ConfigValidator', () => {
  let validator: ConfigValidator;

  beforeEach(() => {
    validator = new ConfigValidator();
  });

  describe('validate', () => {
    it('should validate valid configuration', () => {
      const config: ModernBalmConfig = {
        mode: 'development',
        bundler: 'webpack',
        paths: {
          src: 'src',
          dist: 'dist',
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.config).toBeDefined();
    });

    it('should reject invalid mode', () => {
      const config = {
        mode: 'invalid-mode',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('mode');
      expect(result.errors[0].message).toContain('Invalid build mode');
    });

    it('should reject invalid bundler', () => {
      const config = {
        bundler: 'invalid-bundler',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('bundler');
      expect(result.errors[0].message).toContain('Invalid bundler');
    });

    it('should validate paths configuration', () => {
      const config = {
        paths: {
          src: 123, // Invalid type
          dist: '', // Empty string
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path === 'paths.src')).toBe(true);
      expect(result.errors.some(e => e.path === 'paths.dist')).toBe(true);
    });

    it('should validate dev server configuration', () => {
      const config = {
        devServer: {
          port: 'invalid-port', // Invalid type
          host: 123, // Invalid type
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path === 'devServer.port')).toBe(true);
      expect(result.errors.some(e => e.path === 'devServer.host')).toBe(true);
    });

    it('should validate port range', () => {
      const config = {
        devServer: {
          port: 70000, // Out of range
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('devServer.port');
      expect(result.errors[0].message).toContain('between 1 and 65535');
    });

    it('should validate compiler configuration', () => {
      const config = {
        compiler: {
          primary: 'invalid-compiler',
          jsx: 'not-boolean',
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path === 'compiler.primary')).toBe(true);
      expect(result.errors.some(e => e.path === 'compiler.jsx')).toBe(true);
    });

    it('should handle null/undefined configuration', () => {
      const result1 = validator.validate(null);
      const result2 = validator.validate(undefined);

      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
      expect(result1.errors[0].message).toContain('must be an object');
      expect(result2.errors[0].message).toContain('must be an object');
    });

    it('should normalize configuration with defaults', () => {
      const config = {
        mode: 'production',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.config!.bundler).toBe('webpack'); // Default value
      expect(result.config!.paths.src).toBe('src'); // Default value
      expect(result.config!.devServer.port).toBe(3000); // Default value
    });
  });

  describe('static methods', () => {
    it('should validate using static method', () => {
      const config = { mode: 'development' };
      const result = ConfigValidator.validateSchema(config);

      expect(result.valid).toBe(true);
    });

    it('should check validity using static method', () => {
      const validConfig = { mode: 'development' };
      const invalidConfig = { mode: 'invalid' };

      expect(ConfigValidator.isValid(validConfig)).toBe(true);
      expect(ConfigValidator.isValid(invalidConfig)).toBe(false);
    });

    it('should get errors using static method', () => {
      const config = { mode: 'invalid' };
      const errors = ConfigValidator.getErrors(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('mode');
    });

    it('should normalize using static method', () => {
      const config = { mode: 'development' };
      const normalized = ConfigValidator.normalize(config);

      expect(normalized).toBeDefined();
      expect(normalized!.bundler).toBe('webpack');
    });
  });

  describe('utility functions', () => {
    it('should validate config using utility function', () => {
      const config = { mode: 'development' };
      const result = validateConfig(config);

      expect(result.valid).toBe(true);
    });

    it('should check validity using utility function', () => {
      const validConfig = { mode: 'development' };
      const invalidConfig = { mode: 'invalid' };

      expect(isValidConfig(validConfig)).toBe(true);
      expect(isValidConfig(invalidConfig)).toBe(false);
    });

    it('should normalize using utility function', () => {
      const config = { mode: 'development' };
      const normalized = normalizeConfig(config);

      expect(normalized).toBeDefined();
      expect(normalized!.bundler).toBe('webpack');
    });
  });

  describe('edge cases', () => {
    it('should handle empty configuration', () => {
      const result = validator.validate({});

      expect(result.valid).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.config!.mode).toBe('development');
    });

    it('should handle partial configuration', () => {
      const config = {
        paths: {
          src: 'source',
        },
        devServer: {
          port: 8080,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
      expect(result.config!.paths.src).toBe('source');
      expect(result.config!.paths.dist).toBe('dist'); // Default
      expect(result.config!.devServer.port).toBe(8080);
      expect(result.config!.devServer.host).toBe('localhost'); // Default
    });

    it('should handle nested object validation', () => {
      const config = {
        paths: 'not-an-object',
        devServer: null,
        compiler: 'not-an-object',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'paths')).toBe(true);
      expect(result.errors.some(e => e.path === 'devServer')).toBe(true);
      expect(result.errors.some(e => e.path === 'compiler')).toBe(true);
    });
  });
});