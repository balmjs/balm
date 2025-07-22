/**
 * Error types and interfaces for BalmJS
 */

/**
 * Error categories
 */
export const ErrorCategory = {
  CONFIG: 'config',
  COMPILATION: 'compilation',
  FILE_SYSTEM: 'file-system',
  PLUGIN: 'plugin',
  NETWORK: 'network',
  DEPENDENCY: 'dependency',
  PERFORMANCE: 'performance',
  COMPATIBILITY: 'compatibility',
  RUNTIME: 'runtime',
  VALIDATION: 'validation',
  UNKNOWN: 'unknown',
} as const;

export type ErrorCategoryType = typeof ErrorCategory[keyof typeof ErrorCategory];

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export type ErrorSeverityType = typeof ErrorSeverity[keyof typeof ErrorSeverity];

/**
 * Base BalmJS error interface
 */
export interface BalmError {
  id: string;
  code: string;
  message: string;
  category: ErrorCategoryType;
  severity: ErrorSeverityType;
  timestamp: Date;
  location?: ErrorLocation;
  metadata?: Record<string, any>;
  solutions?: string[];
  docs?: string[];
  stack?: string;
}

/**
 * Error location information
 */
export interface ErrorLocation {
  filePath: string;
  line?: number;
  column?: number;
  length?: number;
  source?: string;
}

/**
 * Configuration error
 */
export interface ConfigError extends BalmError {
  category: typeof ErrorCategory.CONFIG;
  metadata: {
    config?: any;
    configPath?: string;
    property?: string;
    expectedType?: string;
    actualType?: string;
  };
}

/**
 * Compilation error
 */
export interface CompilationError extends BalmError {
  category: typeof ErrorCategory.COMPILATION;
  location: ErrorLocation;
  metadata: {
    compiler?: string;
    phase?: string;
    originalError?: Error;
  };
}

/**
 * Type guard for BalmError
 */
export function isBalmError(obj: any): obj is BalmError {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.severity === 'string' &&
    obj.timestamp instanceof Date
  );
}

/**
 * Type guard for error category
 */
export function isErrorCategory(error: BalmError, category: ErrorCategoryType): boolean {
  return error.category === category;
}

/**
 * Type guard for error severity
 */
export function isErrorSeverity(error: BalmError, severity: ErrorSeverityType): boolean {
  return error.severity === severity;
}

// Additional error types
export interface FileSystemError extends BalmError {
  category: typeof ErrorCategory.FILE_SYSTEM;
}

export interface PluginError extends BalmError {
  category: typeof ErrorCategory.PLUGIN;
}

export interface NetworkError extends BalmError {
  category: typeof ErrorCategory.NETWORK;
}

export interface DependencyError extends BalmError {
  category: typeof ErrorCategory.DEPENDENCY;
}

export interface PerformanceError extends BalmError {
  category: typeof ErrorCategory.PERFORMANCE;
}

export interface CompatibilityError extends BalmError {
  category: typeof ErrorCategory.COMPATIBILITY;
}

export interface ValidationError extends BalmError {
  category: typeof ErrorCategory.VALIDATION;
}

export interface RuntimeError extends BalmError {
  category: typeof ErrorCategory.RUNTIME;
}

export interface ErrorMetadata {
  [key: string]: any;
}