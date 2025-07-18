/**
 * BalmJS Error Handling System
 * 
 * This module provides a comprehensive error handling system for BalmJS with:
 * - Standardized error types and codes
 * - Error classification and severity levels
 * - Rich error context and metadata
 * - Multiple formatting options
 * - Centralized error handling
 * - Recovery mechanisms
 */

// Export types
export * from './types.js';

// Export error codes and definitions
export * from './codes.js';

// Export error factory functions
export * from './factory.js';

// Export error handler
export * from './handler.js';

// Export error formatter
export * from './formatter.js';

// Export code frame generator
export * from './code-frame.js';

// Export suggestion engine
export * from './suggestion-engine.js';

// Re-export commonly used functions for convenience
export {
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
} from './factory.js';

export {
  ErrorHandler,
  getGlobalErrorHandler,
  setGlobalErrorHandler,
  handleError,
  handleErrors,
  hasFatalErrors,
  hasErrors,
  hasWarnings,
  getErrorSummary,
  clearErrors,
} from './handler.js';

export {
  formatError,
  formatErrorForConsole,
  formatErrorForJSON,
  formatErrorForText,
  formatErrorForHTML,
  formatErrors,
  formatErrorSummary,
} from './formatter.js';

export {
  generateCodeFrame,
  generateCodeFrameFromContent,
  generateCodeFrameWithMultipleErrors,
  CodeFrameGenerator,
} from './code-frame.js';

export {
  SuggestionEngine,
  getGlobalSuggestionEngine,
  setGlobalSuggestionEngine,
  suggestForError,
  suggestForErrors,
} from './suggestion-engine.js';

// Export commonly used types for convenience
export type {
  BalmError,
  ConfigError,
  CompilationError,
  FileSystemError,
  PluginError,
  NetworkError,
  DependencyError,
  PerformanceError,
  CompatibilityError,
  ValidationError,
  RuntimeError,
  ErrorLocation,
  ErrorMetadata,
} from './types.js';

export type {
  ErrorCodeDefinition,
} from './codes.js';

export type {
  ErrorHandlerOptions,
} from './handler.js';

export type {
  FormatOptions,
} from './formatter.js';

export type {
  CodeFrameOptions,
  LineInfo,
  CodeFrame,
} from './code-frame.js';

export type {
  SuggestionContext,
  SuggestionRule,
  SuggestionResult,
} from './suggestion-engine.js';

export {
  ErrorCategory,
  ErrorSeverity,
  isBalmError,
  isErrorCategory,
} from './types.js';