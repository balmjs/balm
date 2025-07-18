/**
 * Code frame generator for BalmJS errors
 * Generates code snippets with error highlighting and context
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Code frame options
 */
export interface CodeFrameOptions {
  /**
   * Number of lines to show before the error line
   */
  beforeLines?: number;
  
  /**
   * Number of lines to show after the error line
   */
  afterLines?: number;
  
  /**
   * Whether to show line numbers
   */
  showLineNumbers?: boolean;
  
  /**
   * Whether to highlight the error line
   */
  highlightError?: boolean;
  
  /**
   * Whether to show syntax highlighting
   */
  syntaxHighlighting?: boolean;
  
  /**
   * Maximum line length before truncation
   */
  maxLineLength?: number;
  
  /**
   * Character to use for highlighting
   */
  highlightChar?: string;
  
  /**
   * Whether to use colors
   */
  colors?: boolean;
}

/**
 * Line information
 */
export interface LineInfo {
  /**
   * Line number (1-based)
   */
  number: number;
  
  /**
   * Line content
   */
  content: string;
  
  /**
   * Whether this is the error line
   */
  isError?: boolean;
  
  /**
   * Column position of error (0-based)
   */
  errorColumn?: number;
  
  /**
   * Length of error highlight
   */
  errorLength?: number;
}

/**
 * Code frame result
 */
export interface CodeFrame {
  /**
   * The formatted code frame
   */
  frame: string;
  
  /**
   * Lines included in the frame
   */
  lines: LineInfo[];
  
  /**
   * File path
   */
  filePath?: string;
  
  /**
   * Error line number
   */
  errorLine?: number;
  
  /**
   * Error column number
   */
  errorColumn?: number;
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
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

/**
 * Apply color to text if colors are enabled
 */
function colorize(text: string, color: string, options: CodeFrameOptions): string {
  return options.colors ? `${color}${text}${colors.reset}` : text;
}

/**
 * Get file extension for syntax highlighting
 */
function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase().slice(1);
}

/**
 * Basic syntax highlighting for common file types
 */
function applySyntaxHighlighting(content: string, extension: string, options: CodeFrameOptions): string {
  if (!options.syntaxHighlighting || !options.colors) {
    return content;
  }
  
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return highlightJavaScript(content);
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return highlightCSS(content);
    case 'html':
    case 'htm':
      return highlightHTML(content);
    case 'json':
      return highlightJSON(content);
    default:
      return content;
  }
}

/**
 * Basic JavaScript syntax highlighting
 */
function highlightJavaScript(content: string): string {
  // Keywords
  content = content.replace(
    /\b(const|let|var|function|class|if|else|for|while|do|switch|case|default|try|catch|finally|throw|return|import|export|from|as|async|await|yield|new|this|super|extends|implements|interface|type|enum|namespace|module|declare|public|private|protected|static|readonly|abstract)\b/g,
    `${colors.magenta}$1${colors.reset}`
  );
  
  // Strings
  content = content.replace(
    /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    `${colors.green}$1$2$1${colors.reset}`
  );
  
  // Numbers
  content = content.replace(
    /\b(\d+(?:\.\d+)?)\b/g,
    `${colors.cyan}$1${colors.reset}`
  );
  
  // Comments
  content = content.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    `${colors.gray}$1${colors.reset}`
  );
  
  return content;
}

/**
 * Basic CSS syntax highlighting
 */
function highlightCSS(content: string): string {
  // Properties
  content = content.replace(
    /([a-zA-Z-]+)(\s*:)/g,
    `${colors.blue}$1${colors.reset}$2`
  );
  
  // Values
  content = content.replace(
    /(:\s*)([^;{]+)/g,
    `$1${colors.green}$2${colors.reset}`
  );
  
  // Selectors
  content = content.replace(
    /([.#]?[a-zA-Z][a-zA-Z0-9-_]*)\s*{/g,
    `${colors.yellow}$1${colors.reset} {`
  );
  
  return content;
}

/**
 * Basic HTML syntax highlighting
 */
function highlightHTML(content: string): string {
  // Tags
  content = content.replace(
    /(<\/?)([\w-]+)([^>]*>)/g,
    `${colors.blue}$1${colors.cyan}$2${colors.blue}$3${colors.reset}`
  );
  
  // Attributes
  content = content.replace(
    /(\s+)([\w-]+)(=)(["']?)([^"'>\s]*)\4/g,
    `$1${colors.yellow}$2${colors.reset}$3$4${colors.green}$5${colors.reset}$4`
  );
  
  return content;
}

/**
 * Basic JSON syntax highlighting
 */
function highlightJSON(content: string): string {
  // Keys
  content = content.replace(
    /"([^"]+)"(\s*:)/g,
    `${colors.blue}"$1"${colors.reset}$2`
  );
  
  // String values
  content = content.replace(
    /(:\s*)"([^"]*)"/g,
    `$1${colors.green}"$2"${colors.reset}`
  );
  
  // Numbers
  content = content.replace(
    /(:\s*)(\d+(?:\.\d+)?)/g,
    `$1${colors.cyan}$2${colors.reset}`
  );
  
  // Booleans and null
  content = content.replace(
    /(:\s*)(true|false|null)/g,
    `$1${colors.magenta}$2${colors.reset}`
  );
  
  return content;
}

/**
 * Truncate line if it's too long
 */
function truncateLine(line: string, maxLength: number): string {
  if (maxLength <= 0 || line.length <= maxLength) {
    return line;
  }
  
  const truncated = line.slice(0, maxLength - 3);
  return truncated + '...';
}

/**
 * Generate line number string with padding
 */
function formatLineNumber(lineNumber: number, maxLineNumber: number, options: CodeFrameOptions): string {
  const padding = maxLineNumber.toString().length;
  const formatted = lineNumber.toString().padStart(padding, ' ');
  
  return options.colors 
    ? colorize(formatted, colors.gray, options)
    : formatted;
}

/**
 * Generate error indicator line
 */
function generateErrorIndicator(column: number, length: number = 1, options: CodeFrameOptions): string {
  const spaces = ' '.repeat(Math.max(0, column));
  const indicators = (options.highlightChar || '^').repeat(Math.max(1, length));
  
  return options.colors
    ? spaces + colorize(indicators, colors.red + colors.bright, options)
    : spaces + indicators;
}

/**
 * Read file content safely
 */
function readFileContent(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Generate code frame from file path and position
 */
export function generateCodeFrame(
  filePath: string,
  line: number,
  column: number = 0,
  options: CodeFrameOptions = {}
): CodeFrame | null {
  const opts: CodeFrameOptions = {
    beforeLines: 2,
    afterLines: 2,
    showLineNumbers: true,
    highlightError: true,
    syntaxHighlighting: true,
    maxLineLength: 120,
    highlightChar: '^',
    colors: true,
    ...options,
  };
  
  const content = readFileContent(filePath);
  if (!content) {
    return null;
  }
  
  return generateCodeFrameFromContent(content, line, column, {
    ...opts,
    filePath,
  });
}

/**
 * Generate code frame from content string
 */
export function generateCodeFrameFromContent(
  content: string,
  line: number,
  column: number = 0,
  options: CodeFrameOptions & { filePath?: string } = {}
): CodeFrame {
  const opts: CodeFrameOptions = {
    beforeLines: 2,
    afterLines: 2,
    showLineNumbers: true,
    highlightError: true,
    syntaxHighlighting: true,
    maxLineLength: 120,
    highlightChar: '^',
    colors: true,
    ...options,
  };
  
  const lines = content.split('\n');
  const errorLineIndex = line - 1; // Convert to 0-based
  
  // Calculate line range
  const startLine = Math.max(0, errorLineIndex - (opts.beforeLines || 0));
  const endLine = Math.min(lines.length - 1, errorLineIndex + (opts.afterLines || 0));
  
  // Get file extension for syntax highlighting
  const extension = options.filePath ? getFileExtension(options.filePath) : '';
  
  // Generate line info
  const lineInfos: LineInfo[] = [];
  for (let i = startLine; i <= endLine; i++) {
    const lineNumber = i + 1;
    let lineContent = lines[i] || '';
    
    // Truncate if necessary
    if (opts.maxLineLength && lineContent.length > opts.maxLineLength) {
      lineContent = truncateLine(lineContent, opts.maxLineLength);
    }
    
    // Apply syntax highlighting
    if (opts.syntaxHighlighting && extension) {
      lineContent = applySyntaxHighlighting(lineContent, extension, opts);
    }
    
    lineInfos.push({
      number: lineNumber,
      content: lineContent,
      isError: i === errorLineIndex,
      errorColumn: i === errorLineIndex ? column : undefined,
      errorLength: 1,
    });
  }
  
  // Generate frame
  const frameLines: string[] = [];
  const maxLineNumber = Math.max(...lineInfos.map(info => info.number));
  
  for (const lineInfo of lineInfos) {
    if (opts.showLineNumbers) {
      const lineNumberStr = formatLineNumber(lineInfo.number, maxLineNumber, opts);
      const separator = opts.colors ? colorize(' | ', colors.gray, opts) : ' | ';
      
      if (lineInfo.isError && opts.highlightError) {
        const errorLine = opts.colors
          ? colorize(`${lineNumberStr}${separator}${lineInfo.content}`, colors.red, opts)
          : `${lineNumberStr}${separator}${lineInfo.content}`;
        frameLines.push(errorLine);
        
        // Add error indicator line
        if (lineInfo.errorColumn !== undefined) {
          const indicatorPrefix = ' '.repeat(lineNumberStr.length) + separator;
          const indicator = generateErrorIndicator(lineInfo.errorColumn, lineInfo.errorLength, opts);
          frameLines.push(indicatorPrefix + indicator);
        }
      } else {
        frameLines.push(`${lineNumberStr}${separator}${lineInfo.content}`);
      }
    } else {
      if (lineInfo.isError && opts.highlightError) {
        const errorLine = opts.colors
          ? colorize(lineInfo.content, colors.red, opts)
          : lineInfo.content;
        frameLines.push(errorLine);
        
        // Add error indicator line
        if (lineInfo.errorColumn !== undefined) {
          const indicator = generateErrorIndicator(lineInfo.errorColumn, lineInfo.errorLength, opts);
          frameLines.push(indicator);
        }
      } else {
        frameLines.push(lineInfo.content);
      }
    }
  }
  
  return {
    frame: frameLines.join('\n'),
    lines: lineInfos,
    filePath: options.filePath,
    errorLine: line,
    errorColumn: column,
  };
}

/**
 * Generate code frame with multiple error positions
 */
export function generateCodeFrameWithMultipleErrors(
  filePath: string,
  errors: Array<{ line: number; column: number; length?: number; message?: string }>,
  options: CodeFrameOptions = {}
): CodeFrame | null {
  const content = readFileContent(filePath);
  if (!content) {
    return null;
  }
  
  const opts: CodeFrameOptions = {
    beforeLines: 2,
    afterLines: 2,
    showLineNumbers: true,
    highlightError: true,
    syntaxHighlighting: true,
    maxLineLength: 120,
    highlightChar: '^',
    colors: true,
    ...options,
  };
  
  // Find the range that covers all errors
  const minLine = Math.min(...errors.map(e => e.line));
  const maxLine = Math.max(...errors.map(e => e.line));
  
  const startLine = Math.max(1, minLine - (opts.beforeLines || 0));
  const endLine = Math.min(content.split('\n').length, maxLine + (opts.afterLines || 0));
  
  // Use the first error as the primary error for the main frame generation
  const primaryError = errors[0];
  const frame = generateCodeFrameFromContent(content, primaryError.line, primaryError.column, {
    ...opts,
    filePath,
    beforeLines: primaryError.line - startLine,
    afterLines: endLine - primaryError.line,
  });
  
  if (!frame) {
    return null;
  }
  
  // Add additional error indicators for other errors
  const lines = content.split('\n');
  const frameLines = frame.frame.split('\n');
  const newFrameLines: string[] = [];
  
  for (let i = 0; i < frameLines.length; i++) {
    newFrameLines.push(frameLines[i]);
    
    // Check if this line corresponds to any error line
    const currentLineNumber = startLine + Math.floor(i / (opts.showLineNumbers ? 2 : 1));
    const lineErrors = errors.filter(e => e.line === currentLineNumber);
    
    if (lineErrors.length > 1) {
      // Add additional error indicators for multiple errors on the same line
      for (let j = 1; j < lineErrors.length; j++) {
        const error = lineErrors[j];
        const lineNumberStr = opts.showLineNumbers 
          ? formatLineNumber(error.line, endLine, opts)
          : '';
        const separator = opts.showLineNumbers 
          ? (opts.colors ? colorize(' | ', colors.gray, opts) : ' | ')
          : '';
        const indicatorPrefix = opts.showLineNumbers 
          ? ' '.repeat(lineNumberStr.length) + separator
          : '';
        const indicator = generateErrorIndicator(error.column, error.length || 1, opts);
        
        newFrameLines.push(indicatorPrefix + indicator);
        
        if (error.message) {
          const messagePrefix = opts.showLineNumbers 
            ? ' '.repeat(lineNumberStr.length) + separator
            : '';
          const message = opts.colors
            ? colorize(`${messagePrefix}${error.message}`, colors.yellow, opts)
            : `${messagePrefix}${error.message}`;
          newFrameLines.push(message);
        }
      }
    }
  }
  
  return {
    ...frame,
    frame: newFrameLines.join('\n'),
  };
}

/**
 * Code frame generator class
 */
export class CodeFrameGenerator {
  private options: CodeFrameOptions;
  
  constructor(options: CodeFrameOptions = {}) {
    this.options = {
      beforeLines: 2,
      afterLines: 2,
      showLineNumbers: true,
      highlightError: true,
      syntaxHighlighting: true,
      maxLineLength: 120,
      highlightChar: '^',
      colors: true,
      ...options,
    };
  }
  
  /**
   * Generate code frame from file path
   */
  generateFromFile(filePath: string, line: number, column: number = 0): CodeFrame | null {
    return generateCodeFrame(filePath, line, column, this.options);
  }
  
  /**
   * Generate code frame from content
   */
  generateFromContent(content: string, line: number, column: number = 0, filePath?: string): CodeFrame {
    return generateCodeFrameFromContent(content, line, column, {
      ...this.options,
      filePath,
    });
  }
  
  /**
   * Generate code frame with multiple errors
   */
  generateWithMultipleErrors(
    filePath: string,
    errors: Array<{ line: number; column: number; length?: number; message?: string }>
  ): CodeFrame | null {
    return generateCodeFrameWithMultipleErrors(filePath, errors, this.options);
  }
  
  /**
   * Update options
   */
  setOptions(options: Partial<CodeFrameOptions>): void {
    this.options = { ...this.options, ...options };
  }
  
  /**
   * Get current options
   */
  getOptions(): CodeFrameOptions {
    return { ...this.options };
  }
}