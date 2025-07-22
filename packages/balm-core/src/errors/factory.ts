/**
 * Error factory functions for creating BalmJS errors
 */

import { BalmError, ConfigError, CompilationError, ErrorCategory, ErrorSeverity, ErrorLocation, ErrorCategoryType, ErrorSeverityType } from './types.js';
import { ERROR_CODES } from './codes.js';

/**
 * Create a basic BalmJS error
 */
export function createBalmError(
  code: string,
  message: string,
  category: ErrorCategoryType = ErrorCategory.UNKNOWN,
  severity: ErrorSeverityType = ErrorSeverity.ERROR
): BalmError {
  return {
    id: generateErrorId(),
    code,
    message,
    category,
    severity,
    timestamp: new Date(),
    solutions: [],
    docs: [],
  };
}

/**
 * Create a configuration error
 */
export function createConfigError(
  code: string,
  message: string,
  metadata: ConfigError['metadata'] = {}
): ConfigError {
  return {
    id: generateErrorId(),
    code,
    message,
    category: ErrorCategory.CONFIG,
    severity: ErrorSeverity.ERROR,
    timestamp: new Date(),
    metadata,
    solutions: [],
    docs: [],
  };
}

/**
 * Create a compilation error
 */
export function createCompilationError(
  code: string,
  message: string,
  location: ErrorLocation,
  metadata: CompilationError['metadata'] = {}
): CompilationError {
  return {
    id: generateErrorId(),
    code,
    message,
    category: ErrorCategory.COMPILATION,
    severity: ErrorSeverity.ERROR,
    timestamp: new Date(),
    location,
    metadata,
    solutions: [],
    docs: [],
  };
}

// Export additional error factory functions
export function createFileSystemError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.FILE_SYSTEM, ErrorSeverity.ERROR);
}

export function createPluginError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.PLUGIN, ErrorSeverity.ERROR);
}

export function createNetworkError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.NETWORK, ErrorSeverity.ERROR);
}

export function createDependencyError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.DEPENDENCY, ErrorSeverity.ERROR);
}

export function createPerformanceError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.PERFORMANCE, ErrorSeverity.WARNING);
}

export function createCompatibilityError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.COMPATIBILITY, ErrorSeverity.WARNING);
}

export function createValidationError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.VALIDATION, ErrorSeverity.ERROR);
}

export function createRuntimeError(code: string, message: string, metadata: any = {}): BalmError {
  return createBalmError(code, message, ErrorCategory.RUNTIME, ErrorSeverity.ERROR);
}

export function createErrorFromNativeError(error: Error): BalmError {
  return createBalmError(
    ERROR_CODES.COMPILATION_SYNTAX_001,
    error.message,
    ErrorCategory.COMPILATION,
    ErrorSeverity.ERROR
  );
}

/**
 * Create error from any value
 */
export function createErrorFromAny(error: any): BalmError {
  if (error instanceof Error) {
    return createBalmError(
      ERROR_CODES.COMPILATION_SYNTAX_001,
      error.message,
      ErrorCategory.COMPILATION,
      ErrorSeverity.ERROR
    );
  }
  
  if (typeof error === 'string') {
    return createBalmError(
      ERROR_CODES.COMPILATION_SYNTAX_001,
      error,
      ErrorCategory.UNKNOWN,
      ErrorSeverity.ERROR
    );
  }
  
  return createBalmError(
    ERROR_CODES.COMPILATION_SYNTAX_001,
    'Unknown error occurred',
    ErrorCategory.UNKNOWN,
    ErrorSeverity.ERROR
  );
}

/**
 * Generate unique error ID
 */
function generateErrorId(): string {
  return `balm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}