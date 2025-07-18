/**
 * Tests for error types and type guards
 */

import {
  ErrorCategory,
  ErrorSeverity,
  BalmError,
  ConfigError,
  CompilationError,
  isBalmError,
  isErrorCategory,
} from '../types.js';

describe('Error Types', () => {
  describe('ErrorCategory', () => {
    it('should have all expected categories', () => {
      expect(ErrorCategory.CONFIG).toBe('config');
      expect(ErrorCategory.COMPILATION).toBe('compilation');
      expect(ErrorCategory.FILE_SYSTEM).toBe('file-system');
      expect(ErrorCategory.PLUGIN).toBe('plugin');
      expect(ErrorCategory.NETWORK).toBe('network');
      expect(ErrorCategory.DEPENDENCY).toBe('dependency');
      expect(ErrorCategory.PERFORMANCE).toBe('performance');
      expect(ErrorCategory.COMPATIBILITY).toBe('compatibility');
      expect(ErrorCategory.RUNTIME).toBe('runtime');
      expect(ErrorCategory.VALIDATION).toBe('validation');
      expect(ErrorCategory.UNKNOWN).toBe('unknown');
    });
  });

  describe('ErrorSeverity', () => {
    it('should have all expected severity levels', () => {
      expect(ErrorSeverity.FATAL).toBe('fatal');
      expect(ErrorSeverity.ERROR).toBe('error');
      expect(ErrorSeverity.WARNING).toBe('warning');
      expect(ErrorSeverity.INFO).toBe('info');
    });
  });

  describe('isBalmError', () => {
    it('should return true for valid BalmError objects', () => {
      const error: BalmError = {
        code: 'TEST-001',
        category: ErrorCategory.CONFIG,
        severity: ErrorSeverity.ERROR,
        message: 'Test error',
        timestamp: Date.now(),
      };

      expect(isBalmError(error)).toBe(true);
    });

    it('should return false for invalid objects', () => {
      expect(isBalmError(null)).toBe(false);
      expect(isBalmError(undefined)).toBe(false);
      expect(isBalmError({})).toBe(false);
      expect(isBalmError({ message: 'test' })).toBe(false);
      expect(isBalmError(new Error('test'))).toBe(false);
    });

    it('should return false for objects missing required properties', () => {
      const incompleteError = {
        code: 'TEST-001',
        category: ErrorCategory.CONFIG,
        severity: ErrorSeverity.ERROR,
        // missing message and timestamp
      };

      expect(isBalmError(incompleteError)).toBe(false);
    });
  });

  describe('isErrorCategory', () => {
    it('should return true for matching category', () => {
      const error: BalmError = {
        code: 'CONFIG-001',
        category: ErrorCategory.CONFIG,
        severity: ErrorSeverity.ERROR,
        message: 'Config error',
        timestamp: Date.now(),
      };

      expect(isErrorCategory(error, ErrorCategory.CONFIG)).toBe(true);
    });

    it('should return false for non-matching category', () => {
      const error: BalmError = {
        code: 'CONFIG-001',
        category: ErrorCategory.CONFIG,
        severity: ErrorSeverity.ERROR,
        message: 'Config error',
        timestamp: Date.now(),
      };

      expect(isErrorCategory(error, ErrorCategory.COMPILATION)).toBe(false);
    });
  });

  describe('Specific Error Types', () => {
    it('should properly type ConfigError', () => {
      const configError: ConfigError = {
        code: 'CONFIG-001',
        category: ErrorCategory.CONFIG,
        severity: ErrorSeverity.ERROR,
        message: 'Invalid configuration',
        timestamp: Date.now(),
        metadata: {
          config: { test: true },
          configPath: '/path/to/config',
        },
      };

      expect(configError.category).toBe(ErrorCategory.CONFIG);
      expect(configError.metadata.config).toEqual({ test: true });
      expect(configError.metadata.configPath).toBe('/path/to/config');
    });

    it('should properly type CompilationError', () => {
      const compilationError: CompilationError = {
        code: 'COMPILATION-001',
        category: ErrorCategory.COMPILATION,
        severity: ErrorSeverity.ERROR,
        message: 'Syntax error',
        timestamp: Date.now(),
        location: {
          filePath: '/path/to/file.js',
          line: 10,
          column: 5,
          snippet: 'const x = ;',
        },
      };

      expect(compilationError.category).toBe(ErrorCategory.COMPILATION);
      expect(compilationError.location.filePath).toBe('/path/to/file.js');
      expect(compilationError.location.line).toBe(10);
      expect(compilationError.location.column).toBe(5);
    });
  });
});