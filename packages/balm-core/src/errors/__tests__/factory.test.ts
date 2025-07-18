/**
 * Tests for error factory functions
 */

import {
  createBalmError,
  createConfigError,
  createCompilationError,
  createFileSystemError,
  createPluginError,
  createNetworkError,
  createDependencyError,
  createPerformanceError,
  createCompatibilityError,
  createValidationError,
  createRuntimeError,
  createErrorFromNativeError,
  createErrorFromAny,
} from '../factory.js';
import { ErrorCategory, ErrorSeverity } from '../types.js';

describe('Error Factory', () => {
  describe('createBalmError', () => {
    it('should create a basic error with known error code', () => {
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'balm.config.js' });

      expect(error.code).toBe('CONFIG-SYNTAX-001');
      expect(error.category).toBe(ErrorCategory.CONFIG);
      expect(error.severity).toBe(ErrorSeverity.FATAL);
      expect(error.message).toContain('balm.config.js');
      expect(error.timestamp).toBeGreaterThan(0);
    });

    it('should throw error for unknown error code', () => {
      expect(() => {
        createBalmError('UNKNOWN-CODE-999');
      }).toThrow('Unknown error code: UNKNOWN-CODE-999');
    });

    it('should replace template variables in message', () => {
      const error = createBalmError('CONFIG-VALUE-001', {
        property: 'output.path',
        value: 'invalid',
        expected: 'string',
      });

      expect(error.message).toContain('output.path');
      expect(error.message).toContain('invalid');
    });

    it('should include solutions and docs from error definition', () => {
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });

      expect(error.solutions).toBeDefined();
      expect(error.solutions!.length).toBeGreaterThan(0);
      expect(error.docs).toBeDefined();
      expect(error.docs!.length).toBeGreaterThan(0);
    });
  });

  describe('createConfigError', () => {
    it('should create a config error with proper metadata', () => {
      const config = { output: { path: 'dist' } };
      const error = createConfigError('CONFIG-REQUIRED-001', { property: 'input' }, {
        config,
        configPath: '/path/to/config.js',
      });

      expect(error.category).toBe(ErrorCategory.CONFIG);
      expect(error.metadata.config).toEqual(config);
      expect(error.metadata.configPath).toBe('/path/to/config.js');
    });
  });

  describe('createCompilationError', () => {
    it('should create a compilation error with location', () => {
      const location = {
        filePath: '/src/index.js',
        line: 10,
        column: 5,
        snippet: 'const x = ;',
      };
      const error = createCompilationError('COMPILATION-SYNTAX-001', {
        file: 'index.js',
        message: 'Unexpected token',
      }, { location });

      expect(error.category).toBe(ErrorCategory.COMPILATION);
      expect(error.location).toEqual(location);
    });
  });

  describe('createFileSystemError', () => {
    it('should create a file system error with file path', () => {
      const error = createFileSystemError('FILE-SYSTEM-NOTFOUND-001', {
        file: '/missing/file.js',
      }, {
        filePath: '/missing/file.js',
      });

      expect(error.category).toBe(ErrorCategory.FILE_SYSTEM);
      expect(error.location.filePath).toBe('/missing/file.js');
    });
  });

  describe('createPluginError', () => {
    it('should create a plugin error with plugin metadata', () => {
      const plugin = { name: 'test-plugin', version: '1.0.0' };
      const error = createPluginError('PLUGIN-NOTFOUND-001', { plugin: 'test-plugin' }, {
        plugin,
      });

      expect(error.category).toBe(ErrorCategory.PLUGIN);
      expect(error.metadata.plugin).toEqual(plugin);
    });
  });

  describe('createNetworkError', () => {
    it('should create a network error with URL and status code', () => {
      const error = createNetworkError('NETWORK-HTTP-001', {
        statusCode: 404,
        url: 'https://example.com/api',
      }, {
        url: 'https://example.com/api',
        statusCode: 404,
      });

      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.metadata.url).toBe('https://example.com/api');
      expect(error.metadata.statusCode).toBe(404);
    });
  });

  describe('createDependencyError', () => {
    it('should create a dependency error with package info', () => {
      const packageInfo = {
        name: 'missing-package',
        version: '1.0.0',
        requiredVersion: '^2.0.0',
      };
      const error = createDependencyError('DEPENDENCY-MISSING-001', {
        package: 'missing-package',
      }, {
        package: packageInfo,
      });

      expect(error.category).toBe(ErrorCategory.DEPENDENCY);
      expect(error.metadata.package).toEqual(packageInfo);
    });
  });

  describe('createPerformanceError', () => {
    it('should create a performance error with metrics', () => {
      const error = createPerformanceError('PERFORMANCE-BUILD-001', {
        actual: 5000,
        threshold: 3000,
      }, {
        actual: 5000,
        threshold: 3000,
        metric: 'build-time',
      });

      expect(error.category).toBe(ErrorCategory.PERFORMANCE);
      expect(error.metadata.actual).toBe(5000);
      expect(error.metadata.threshold).toBe(3000);
      expect(error.metadata.metric).toBe('build-time');
    });
  });

  describe('createCompatibilityError', () => {
    it('should create a compatibility error with version info', () => {
      const error = createCompatibilityError('COMPATIBILITY-NODE-001', {
        nodeVersion: 'v12.0.0',
        requiredNodeVersion: '>=14.0.0',
      }, {
        nodeVersion: 'v12.0.0',
        requiredNodeVersion: '>=14.0.0',
      });

      expect(error.category).toBe(ErrorCategory.COMPATIBILITY);
      expect(error.metadata.nodeVersion).toBe('v12.0.0');
      expect(error.metadata.requiredNodeVersion).toBe('>=14.0.0');
    });
  });

  describe('createValidationError', () => {
    it('should create a validation error with validation details', () => {
      const validationErrors = [
        { path: 'config.output', message: 'Required property missing', value: undefined },
        { path: 'config.input', message: 'Invalid type', value: 123 },
      ];
      const error = createValidationError('VALIDATION-SCHEMA-001', {
        message: 'Schema validation failed',
      }, {
        validationErrors,
      });

      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.metadata.validationErrors).toEqual(validationErrors);
    });
  });

  describe('createRuntimeError', () => {
    it('should create a runtime error with stack trace', () => {
      const stack = 'Error: Test\n    at test.js:1:1';
      const error = createRuntimeError('RUNTIME-UNCAUGHT-001', {
        message: 'Uncaught exception',
      }, {
        stack,
      });

      expect(error.category).toBe(ErrorCategory.RUNTIME);
      expect(error.metadata.stack).toBe(stack);
    });
  });

  describe('createErrorFromNativeError', () => {
    it('should convert SyntaxError to compilation error', () => {
      const nativeError = new SyntaxError('Unexpected token');
      const error = createErrorFromNativeError(nativeError);

      expect(error.code).toBe('COMPILATION-SYNTAX-001');
      expect(error.category).toBe(ErrorCategory.COMPILATION);
      expect(error.cause).toBe(nativeError);
    });

    it('should convert module not found error', () => {
      const nativeError = new Error("Cannot find module 'missing-module'");
      const error = createErrorFromNativeError(nativeError);

      expect(error.code).toBe('COMPILATION-MODULE-001');
      expect(error.category).toBe(ErrorCategory.COMPILATION);
      expect(error.cause).toBe(nativeError);
    });

    it('should convert TypeError to runtime error', () => {
      const nativeError = new TypeError('Cannot read property of undefined');
      const error = createErrorFromNativeError(nativeError);

      expect(error.code).toBe('RUNTIME-UNCAUGHT-001');
      expect(error.category).toBe(ErrorCategory.RUNTIME);
      expect(error.cause).toBe(nativeError);
    });

    it('should handle generic errors', () => {
      const nativeError = new Error('Generic error');
      const error = createErrorFromNativeError(nativeError);

      expect(error.code).toBe('RUNTIME-UNCAUGHT-001');
      expect(error.message).toBe('Generic error');
      expect(error.cause).toBe(nativeError);
    });
  });

  describe('createErrorFromAny', () => {
    it('should handle Error objects', () => {
      const nativeError = new Error('Test error');
      const error = createErrorFromAny(nativeError);

      expect(error.cause).toBe(nativeError);
      expect(error.message).toBe('Test error');
    });

    it('should handle string values', () => {
      const error = createErrorFromAny('String error');

      expect(error.message).toBe('String error');
      expect(error.details).toBe('String error');
    });

    it('should handle object values', () => {
      const obj = { message: 'Object error', code: 123 };
      const error = createErrorFromAny(obj);

      expect(error.message).toBe('Object error');
      expect(error.details).toContain('Object error');
      expect(error.details).toContain('123');
    });

    it('should handle primitive values', () => {
      const error = createErrorFromAny(42);

      expect(error.message).toBe('42');
      expect(error.details).toBe('42');
    });
  });
});