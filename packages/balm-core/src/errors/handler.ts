/**
 * Error handler for BalmJS
 * Provides centralized error handling, formatting, and reporting
 */

import { BalmError, ErrorSeverity, isBalmError } from './types.js';
import { createErrorFromAny } from './factory.js';

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  /**
   * Whether to exit the process on fatal errors
   */
  exitOnFatal?: boolean;
  
  /**
   * Whether to log errors to the console
   */
  logToConsole?: boolean;
  
  /**
   * Whether to collect errors for later reporting
   */
  collectErrors?: boolean;
  
  /**
   * Custom error formatter function
   */
  formatter?: (error: BalmError) => string;
  
  /**
   * Custom error reporter function
   */
  reporter?: (error: BalmError) => void;
  
  /**
   * Custom error filter function
   */
  filter?: (error: BalmError) => boolean;
}

/**
 * Error handler class
 */
export class ErrorHandler {
  private options: ErrorHandlerOptions;
  private errors: BalmError[] = [];
  private fatalErrorOccurred = false;
  
  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      exitOnFatal: true,
      logToConsole: true,
      collectErrors: true,
      ...options,
    };
    
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }
  
  /**
   * Handle an error
   */
  handleError(error: Error | BalmError | any): BalmError {
    // Convert to BalmError if needed
    const balmError = isBalmError(error) ? error : createErrorFromAny(error);
    
    // Apply filter if provided
    if (this.options.filter && !this.options.filter(balmError)) {
      return balmError;
    }
    
    // Collect error if enabled
    if (this.options.collectErrors) {
      this.errors.push(balmError);
    }
    
    // Check if this is a fatal error
    if (balmError.severity === ErrorSeverity.FATAL) {
      this.fatalErrorOccurred = true;
    }
    
    // Log to console if enabled
    if (this.options.logToConsole) {
      this.logError(balmError);
    }
    
    // Use custom reporter if provided
    if (this.options.reporter) {
      this.options.reporter(balmError);
    }
    
    // Exit on fatal error if enabled
    if (balmError.severity === ErrorSeverity.FATAL && this.options.exitOnFatal) {
      process.exit(1);
    }
    
    return balmError;
  }
  
  /**
   * Handle multiple errors
   */
  handleErrors(errors: (Error | BalmError | any)[]): BalmError[] {
    return errors.map(error => this.handleError(error));
  }
  
  /**
   * Get all collected errors
   */
  getErrors(): BalmError[] {
    return [...this.errors];
  }
  
  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): BalmError[] {
    return this.errors.filter(error => error.severity === severity);
  }
  
  /**
   * Get fatal errors
   */
  getFatalErrors(): BalmError[] {
    return this.getErrorsBySeverity(ErrorSeverity.FATAL);
  }
  
  /**
   * Get regular errors
   */
  getRegularErrors(): BalmError[] {
    return this.getErrorsBySeverity(ErrorSeverity.ERROR);
  }
  
  /**
   * Get warnings
   */
  getWarnings(): BalmError[] {
    return this.getErrorsBySeverity(ErrorSeverity.WARNING);
  }
  
  /**
   * Get info messages
   */
  getInfoMessages(): BalmError[] {
    return this.getErrorsBySeverity(ErrorSeverity.INFO);
  }
  
  /**
   * Check if any fatal errors occurred
   */
  hasFatalErrors(): boolean {
    return this.fatalErrorOccurred;
  }
  
  /**
   * Check if any errors occurred
   */
  hasErrors(): boolean {
    return this.errors.some(error => 
      error.severity === ErrorSeverity.ERROR || 
      error.severity === ErrorSeverity.FATAL
    );
  }
  
  /**
   * Check if any warnings occurred
   */
  hasWarnings(): boolean {
    return this.errors.some(error => error.severity === ErrorSeverity.WARNING);
  }
  
  /**
   * Clear all collected errors
   */
  clearErrors(): void {
    this.errors = [];
    this.fatalErrorOccurred = false;
  }
  
  /**
   * Get error summary
   */
  getSummary(): {
    total: number;
    fatal: number;
    errors: number;
    warnings: number;
    info: number;
  } {
    return {
      total: this.errors.length,
      fatal: this.getFatalErrors().length,
      errors: this.getRegularErrors().length,
      warnings: this.getWarnings().length,
      info: this.getInfoMessages().length,
    };
  }
  
  /**
   * Log an error to the console
   */
  private logError(error: BalmError): void {
    const formatted = this.options.formatter 
      ? this.options.formatter(error)
      : this.formatErrorForConsole(error);
    
    switch (error.severity) {
      case ErrorSeverity.FATAL:
        console.error(formatted);
        break;
      case ErrorSeverity.ERROR:
        console.error(formatted);
        break;
      case ErrorSeverity.WARNING:
        console.warn(formatted);
        break;
      case ErrorSeverity.INFO:
        console.info(formatted);
        break;
    }
  }
  
  /**
   * Format error for console output
   */
  private formatErrorForConsole(error: BalmError): string {
    const lines: string[] = [];
    
    // Error header with severity and code
    const severityIcon = this.getSeverityIcon(error.severity);
    lines.push(`${severityIcon} [${error.code}] ${error.message}`);
    
    // Details if available
    if (error.details) {
      lines.push(`   ${error.details}`);
    }
    
    // Location if available
    if (error.location?.filePath) {
      let location = error.location.filePath;
      if (error.location.line) {
        location += `:${error.location.line}`;
        if (error.location.column) {
          location += `:${error.location.column}`;
        }
      }
      lines.push(`   at ${location}`);
    }
    
    // Code snippet if available
    if (error.location?.snippet) {
      lines.push('');
      lines.push(error.location.snippet);
    }
    
    // Solutions if available
    if (error.solutions && error.solutions.length > 0) {
      lines.push('');
      lines.push('💡 Possible solutions:');
      error.solutions.forEach((solution, index) => {
        lines.push(`   ${index + 1}. ${solution}`);
      });
    }
    
    // Documentation links if available
    if (error.docs && error.docs.length > 0) {
      lines.push('');
      lines.push('📚 Documentation:');
      error.docs.forEach(doc => {
        lines.push(`   ${doc}`);
      });
    }
    
    return lines.join('\n');
  }
  
  /**
   * Get severity icon for console output
   */
  private getSeverityIcon(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.FATAL:
        return '💥';
      case ErrorSeverity.ERROR:
        return '❌';
      case ErrorSeverity.WARNING:
        return '⚠️';
      case ErrorSeverity.INFO:
        return 'ℹ️';
      default:
        return '❓';
    }
  }
  
  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.handleError(error);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      this.handleError(reason);
    });
    
    // Handle warnings
    process.on('warning', (warning: Error) => {
      const balmError = createErrorFromAny(warning);
      balmError.severity = ErrorSeverity.WARNING;
      this.handleError(balmError);
    });
  }
}

/**
 * Global error handler instance
 */
let globalErrorHandler: ErrorHandler | null = null;

/**
 * Get the global error handler
 */
export function getGlobalErrorHandler(): ErrorHandler {
  if (!globalErrorHandler) {
    globalErrorHandler = new ErrorHandler();
  }
  return globalErrorHandler;
}

/**
 * Set the global error handler
 */
export function setGlobalErrorHandler(handler: ErrorHandler): void {
  globalErrorHandler = handler;
}

/**
 * Handle an error using the global error handler
 */
export function handleError(error: Error | BalmError | any): BalmError {
  return getGlobalErrorHandler().handleError(error);
}

/**
 * Handle multiple errors using the global error handler
 */
export function handleErrors(errors: (Error | BalmError | any)[]): BalmError[] {
  return getGlobalErrorHandler().handleErrors(errors);
}

/**
 * Check if any fatal errors occurred
 */
export function hasFatalErrors(): boolean {
  return getGlobalErrorHandler().hasFatalErrors();
}

/**
 * Check if any errors occurred
 */
export function hasErrors(): boolean {
  return getGlobalErrorHandler().hasErrors();
}

/**
 * Check if any warnings occurred
 */
export function hasWarnings(): boolean {
  return getGlobalErrorHandler().hasWarnings();
}

/**
 * Get error summary
 */
export function getErrorSummary(): {
  total: number;
  fatal: number;
  errors: number;
  warnings: number;
  info: number;
} {
  return getGlobalErrorHandler().getSummary();
}

/**
 * Clear all errors
 */
export function clearErrors(): void {
  getGlobalErrorHandler().clearErrors();
}