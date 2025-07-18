/**
 * Tests for error handler
 */

import { ErrorHandler, getGlobalErrorHandler, setGlobalErrorHandler } from '../handler.js';
import { createBalmError, createConfigError } from '../factory.js';
import { ErrorCategory, ErrorSeverity, BalmError } from '../types.js';

describe('ErrorHandler', () => {
  let handler: ErrorHandler;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    handler = new ErrorHandler({
      exitOnFatal: false, // Prevent process.exit in tests
      logToConsole: false, // Prevent console output in tests
    });
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should create handler with default options', () => {
      const defaultHandler = new ErrorHandler();
      expect(defaultHandler).toBeInstanceOf(ErrorHandler);
    });

    it('should create handler with custom options', () => {
      const customHandler = new ErrorHandler({
        exitOnFatal: false,
        logToConsole: false,
        collectErrors: false,
      });
      expect(customHandler).toBeInstanceOf(ErrorHandler);
    });
  });

  describe('handleError', () => {
    it('should handle BalmError objects', () => {
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      const result = handler.handleError(error);

      expect(result).toBe(error);
      expect(handler.getErrors()).toContain(error);
    });

    it('should convert native Error objects', () => {
      const nativeError = new Error('Test error');
      const result = handler.handleError(nativeError);

      expect(result.message).toBe('Test error');
      expect(result.cause).toBe(nativeError);
      expect(handler.getErrors()).toContain(result);
    });

    it('should convert string errors', () => {
      const result = handler.handleError('String error');

      expect(result.message).toBe('String error');
      expect(handler.getErrors()).toContain(result);
    });

    it('should track fatal errors', () => {
      const fatalError = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      handler.handleError(fatalError);

      expect(handler.hasFatalErrors()).toBe(true);
    });

    it('should apply custom filter', () => {
      const filterHandler = new ErrorHandler({
        filter: (error) => error.severity !== ErrorSeverity.WARNING,
        collectErrors: true,
      });

      const warning = createBalmError('CONFIG-DEPRECATED-001', { property: 'old' });
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });

      filterHandler.handleError(warning);
      filterHandler.handleError(error);

      expect(filterHandler.getErrors()).toHaveLength(1);
      expect(filterHandler.getErrors()[0]).toBe(error);
    });

    it('should use custom formatter when logging', () => {
      const formatter = jest.fn().mockReturnValue('Custom formatted error');
      const logHandler = new ErrorHandler({
        logToConsole: true,
        formatter,
      });
      const logSpy = jest.spyOn(console, 'error').mockImplementation();

      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      logHandler.handleError(error);

      expect(formatter).toHaveBeenCalledWith(error);
      expect(logSpy).toHaveBeenCalledWith('Custom formatted error');

      logSpy.mockRestore();
    });

    it('should use custom reporter', () => {
      const reporter = jest.fn();
      const reportHandler = new ErrorHandler({ reporter });

      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      reportHandler.handleError(error);

      expect(reporter).toHaveBeenCalledWith(error);
    });
  });

  describe('handleErrors', () => {
    it('should handle multiple errors', () => {
      const errors = [
        new Error('Error 1'),
        'String error',
        createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' }),
      ];

      const results = handler.handleErrors(errors);

      expect(results).toHaveLength(3);
      expect(handler.getErrors()).toHaveLength(3);
    });
  });

  describe('error retrieval methods', () => {
    beforeEach(() => {
      handler.handleError(createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' })); // FATAL
      handler.handleError(createBalmError('CONFIG-VALUE-001', { property: 'test', value: 'invalid', expected: 'string' })); // ERROR
      handler.handleError(createBalmError('CONFIG-DEPRECATED-001', { property: 'old' })); // WARNING
      handler.handleError(createBalmError('PERFORMANCE-BUILD-001', { actual: 5000, threshold: 3000 })); // WARNING
    });

    it('should get all errors', () => {
      expect(handler.getErrors()).toHaveLength(4);
    });

    it('should get errors by severity', () => {
      expect(handler.getErrorsBySeverity(ErrorSeverity.FATAL)).toHaveLength(1);
      expect(handler.getErrorsBySeverity(ErrorSeverity.ERROR)).toHaveLength(1);
      expect(handler.getErrorsBySeverity(ErrorSeverity.WARNING)).toHaveLength(2);
      expect(handler.getErrorsBySeverity(ErrorSeverity.INFO)).toHaveLength(0);
    });

    it('should get fatal errors', () => {
      expect(handler.getFatalErrors()).toHaveLength(1);
    });

    it('should get regular errors', () => {
      expect(handler.getRegularErrors()).toHaveLength(1);
    });

    it('should get warnings', () => {
      expect(handler.getWarnings()).toHaveLength(2);
    });

    it('should get info messages', () => {
      expect(handler.getInfoMessages()).toHaveLength(0);
    });

    it('should check for fatal errors', () => {
      expect(handler.hasFatalErrors()).toBe(true);
    });

    it('should check for errors', () => {
      expect(handler.hasErrors()).toBe(true);
    });

    it('should check for warnings', () => {
      expect(handler.hasWarnings()).toBe(true);
    });

    it('should get error summary', () => {
      const summary = handler.getSummary();
      expect(summary.total).toBe(4);
      expect(summary.fatal).toBe(1);
      expect(summary.errors).toBe(1);
      expect(summary.warnings).toBe(2);
      expect(summary.info).toBe(0);
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', () => {
      handler.handleError(createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' }));
      expect(handler.getErrors()).toHaveLength(1);
      expect(handler.hasFatalErrors()).toBe(true);

      handler.clearErrors();
      expect(handler.getErrors()).toHaveLength(0);
      expect(handler.hasFatalErrors()).toBe(false);
    });
  });

  describe('global error handler', () => {
    it('should get global error handler', () => {
      const global = getGlobalErrorHandler();
      expect(global).toBeInstanceOf(ErrorHandler);
    });

    it('should set global error handler', () => {
      const customHandler = new ErrorHandler();
      setGlobalErrorHandler(customHandler);
      expect(getGlobalErrorHandler()).toBe(customHandler);
    });
  });

  describe('console logging', () => {
    let logHandler: ErrorHandler;
    let errorSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let infoSpy: jest.SpyInstance;

    beforeEach(() => {
      logHandler = new ErrorHandler({ logToConsole: true });
      errorSpy = jest.spyOn(console, 'error').mockImplementation();
      warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      infoSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    afterEach(() => {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
      infoSpy.mockRestore();
    });

    it('should log fatal errors to console.error', () => {
      const error = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      logHandler.handleError(error);

      expect(errorSpy).toHaveBeenCalled();
    });

    it('should log regular errors to console.error', () => {
      const error = createBalmError('CONFIG-VALUE-001', { property: 'test', value: 'invalid', expected: 'string' });
      logHandler.handleError(error);

      expect(errorSpy).toHaveBeenCalled();
    });

    it('should log warnings to console.warn', () => {
      const error = createBalmError('CONFIG-DEPRECATED-001', { property: 'old' });
      logHandler.handleError(error);

      expect(warnSpy).toHaveBeenCalled();
    });
  });
});