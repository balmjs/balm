/**
 * Error formatter for BalmJS
 * Provides various formatting options for error display
 */

import { BalmError, ErrorSeverity } from './types.js';

/**
 * Formatting options
 */
export interface FormatOptions {
  /**
   * Whether to include colors in the output
   */
  colors?: boolean;
  
  /**
   * Whether to include icons/emojis
   */
  icons?: boolean;
  
  /**
   * Whether to include the full stack trace
   */
  includeStack?: boolean;
  
  /**
   * Whether to include solutions
   */
  includeSolutions?: boolean;
  
  /**
   * Whether to include documentation links
   */
  includeDocs?: boolean;
  
  /**
   * Whether to include metadata
   */
  includeMetadata?: boolean;
  
  /**
   * Maximum width for formatting
   */
  maxWidth?: number;
  
  /**
   * Indentation string
   */
  indent?: string;
}

/**
 * ANSI color codes
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

/**
 * Apply color to text if colors are enabled
 */
function colorize(text: string, color: string, options: FormatOptions): string {
  return options.colors ? `${color}${text}${colors.reset}` : text;
}

/**
 * Get severity color
 */
function getSeverityColor(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.FATAL:
      return colors.red;
    case ErrorSeverity.ERROR:
      return colors.red;
    case ErrorSeverity.WARNING:
      return colors.yellow;
    case ErrorSeverity.INFO:
      return colors.blue;
    default:
      return colors.white;
  }
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity: ErrorSeverity): string {
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
 * Wrap text to specified width
 */
function wrapText(text: string, width: number, indent: string = ''): string {
  if (width <= 0) return text;
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(indent + currentLine);
        currentLine = word;
      } else {
        lines.push(indent + word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(indent + currentLine);
  }
  
  return lines.join('\n');
}

/**
 * Format error for console output
 */
export function formatErrorForConsole(error: BalmError, options: FormatOptions = {}): string {
  const opts: FormatOptions = {
    colors: true,
    icons: true,
    includeStack: false,
    includeSolutions: true,
    includeDocs: true,
    includeMetadata: false,
    maxWidth: 80,
    indent: '  ',
    ...options,
  };
  
  const lines: string[] = [];
  const severityColor = getSeverityColor(error.severity);
  const icon = opts.icons ? getSeverityIcon(error.severity) + ' ' : '';
  
  // Error header
  const header = `${icon}[${error.code}] ${error.message}`;
  lines.push(colorize(header, severityColor + colors.bright, opts));
  
  // Details
  if (error.details) {
    const details = opts.maxWidth 
      ? wrapText(error.details, opts.maxWidth - opts.indent!.length, opts.indent)
      : opts.indent + error.details;
    lines.push(colorize(details, colors.dim, opts));
  }
  
  // Location
  if (error.location?.filePath) {
    let location = error.location.filePath;
    if (error.location.line) {
      location += `:${error.location.line}`;
      if (error.location.column) {
        location += `:${error.location.column}`;
      }
    }
    lines.push(colorize(`${opts.indent}at ${location}`, colors.gray, opts));
  }
  
  // Code snippet
  if (error.location?.snippet) {
    lines.push('');
    const snippetLines = error.location.snippet.split('\n');
    snippetLines.forEach(line => {
      lines.push(colorize(`${opts.indent}${line}`, colors.gray, opts));
    });
  }
  
  // Stack trace
  if (opts.includeStack && error.cause?.stack) {
    lines.push('');
    lines.push(colorize('Stack trace:', colors.dim, opts));
    const stackLines = error.cause.stack.split('\n');
    stackLines.forEach(line => {
      lines.push(colorize(`${opts.indent}${line}`, colors.gray, opts));
    });
  }
  
  // Metadata
  if (opts.includeMetadata && error.metadata && Object.keys(error.metadata).length > 0) {
    lines.push('');
    lines.push(colorize('Additional information:', colors.dim, opts));
    Object.entries(error.metadata).forEach(([key, value]) => {
      const valueStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      lines.push(colorize(`${opts.indent}${key}: ${valueStr}`, colors.gray, opts));
    });
  }
  
  // Solutions
  if (opts.includeSolutions && error.solutions && error.solutions.length > 0) {
    lines.push('');
    lines.push(colorize('💡 Possible solutions:', colors.cyan, opts));
    error.solutions.forEach((solution, index) => {
      const solutionText = opts.maxWidth 
        ? wrapText(`${index + 1}. ${solution}`, opts.maxWidth - opts.indent!.length, opts.indent)
        : `${opts.indent}${index + 1}. ${solution}`;
      lines.push(colorize(solutionText, colors.white, opts));
    });
  }
  
  // Documentation
  if (opts.includeDocs && error.docs && error.docs.length > 0) {
    lines.push('');
    lines.push(colorize('📚 Documentation:', colors.cyan, opts));
    error.docs.forEach(doc => {
      lines.push(colorize(`${opts.indent}${doc}`, colors.blue, opts));
    });
  }
  
  return lines.join('\n');
}

/**
 * Format error for JSON output
 */
export function formatErrorForJSON(error: BalmError): string {
  return JSON.stringify(error, null, 2);
}

/**
 * Format error for plain text output
 */
export function formatErrorForText(error: BalmError, options: FormatOptions = {}): string {
  return formatErrorForConsole(error, { ...options, colors: false, icons: false });
}

/**
 * Format error for HTML output
 */
export function formatErrorForHTML(error: BalmError): string {
  const severityClass = `error-${error.severity}`;
  const lines: string[] = [];
  
  lines.push(`<div class="balm-error ${severityClass}">`);
  
  // Header
  lines.push(`  <div class="error-header">`);
  lines.push(`    <span class="error-code">[${error.code}]</span>`);
  lines.push(`    <span class="error-message">${escapeHtml(error.message)}</span>`);
  lines.push(`  </div>`);
  
  // Details
  if (error.details) {
    lines.push(`  <div class="error-details">`);
    lines.push(`    <pre>${escapeHtml(error.details)}</pre>`);
    lines.push(`  </div>`);
  }
  
  // Location
  if (error.location?.filePath) {
    lines.push(`  <div class="error-location">`);
    let location = error.location.filePath;
    if (error.location.line) {
      location += `:${error.location.line}`;
      if (error.location.column) {
        location += `:${error.location.column}`;
      }
    }
    lines.push(`    <span class="location">at ${escapeHtml(location)}</span>`);
    lines.push(`  </div>`);
  }
  
  // Code snippet
  if (error.location?.snippet) {
    lines.push(`  <div class="error-snippet">`);
    lines.push(`    <pre><code>${escapeHtml(error.location.snippet)}</code></pre>`);
    lines.push(`  </div>`);
  }
  
  // Solutions
  if (error.solutions && error.solutions.length > 0) {
    lines.push(`  <div class="error-solutions">`);
    lines.push(`    <h4>Possible solutions:</h4>`);
    lines.push(`    <ol>`);
    error.solutions.forEach(solution => {
      lines.push(`      <li>${escapeHtml(solution)}</li>`);
    });
    lines.push(`    </ol>`);
    lines.push(`  </div>`);
  }
  
  // Documentation
  if (error.docs && error.docs.length > 0) {
    lines.push(`  <div class="error-docs">`);
    lines.push(`    <h4>Documentation:</h4>`);
    lines.push(`    <ul>`);
    error.docs.forEach(doc => {
      lines.push(`      <li><a href="${escapeHtml(doc)}" target="_blank">${escapeHtml(doc)}</a></li>`);
    });
    lines.push(`    </ul>`);
    lines.push(`  </div>`);
  }
  
  lines.push(`</div>`);
  
  return lines.join('\n');
}

/**
 * Format multiple errors
 */
export function formatErrors(errors: BalmError[], options: FormatOptions = {}): string {
  if (errors.length === 0) {
    return 'No errors to display.';
  }
  
  const lines: string[] = [];
  
  // Summary
  const summary = {
    fatal: errors.filter(e => e.severity === ErrorSeverity.FATAL).length,
    errors: errors.filter(e => e.severity === ErrorSeverity.ERROR).length,
    warnings: errors.filter(e => e.severity === ErrorSeverity.WARNING).length,
    info: errors.filter(e => e.severity === ErrorSeverity.INFO).length,
  };
  
  const summaryParts: string[] = [];
  if (summary.fatal > 0) summaryParts.push(`${summary.fatal} fatal`);
  if (summary.errors > 0) summaryParts.push(`${summary.errors} errors`);
  if (summary.warnings > 0) summaryParts.push(`${summary.warnings} warnings`);
  if (summary.info > 0) summaryParts.push(`${summary.info} info`);
  
  lines.push(`Found ${summaryParts.join(', ')}:\n`);
  
  // Individual errors
  errors.forEach((error, index) => {
    if (index > 0) {
      lines.push('\n' + '─'.repeat(options.maxWidth || 80) + '\n');
    }
    lines.push(formatErrorForConsole(error, options));
  });
  
  return lines.join('\n');
}

/**
 * Format error summary
 */
export function formatErrorSummary(summary: {
  total: number;
  fatal: number;
  errors: number;
  warnings: number;
  info: number;
}, options: FormatOptions = {}): string {
  if (summary.total === 0) {
    return colorize('✅ No errors found!', colors.green, options);
  }
  
  const parts: string[] = [];
  
  if (summary.fatal > 0) {
    parts.push(colorize(`${summary.fatal} fatal`, colors.red, options));
  }
  
  if (summary.errors > 0) {
    parts.push(colorize(`${summary.errors} errors`, colors.red, options));
  }
  
  if (summary.warnings > 0) {
    parts.push(colorize(`${summary.warnings} warnings`, colors.yellow, options));
  }
  
  if (summary.info > 0) {
    parts.push(colorize(`${summary.info} info`, colors.blue, options));
  }
  
  const icon = summary.fatal > 0 || summary.errors > 0 ? '❌' : '⚠️';
  return `${icon} Found ${parts.join(', ')}`;
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Format error for different output formats
 */
export function formatError(error: BalmError, format: 'console' | 'json' | 'text' | 'html' = 'console', options: FormatOptions = {}): string {
  switch (format) {
    case 'json':
      return formatErrorForJSON(error);
    case 'text':
      return formatErrorForText(error, options);
    case 'html':
      return formatErrorForHTML(error);
    case 'console':
    default:
      return formatErrorForConsole(error, options);
  }
}