/**
 * Tests for error formatter
 */

import {
  formatError,
  formatErrorForConsole,
  formatErrorForJSON,
  formatErrorForText,
  formatErrorForHTML,
  formatErrors,
  formatErrorSummary,
} from '../formatter.js';
import { createBalmError, createCompilationError } from '../factory.js';
import { ErrorSeverity } from '../types.js';

describe('Error Formatter', () => {
  const sampleError = createBalmError('CONFIG-SYNTAX-001', { file: 'balm.config.js' });
  const compilationError = createCompilationError('COMPILATION-SYNTAX-001', {
    file: 'index.js',
    message: 'Unexpected token',
  }, {
    location: {
      filePath: '/src/index.js',
      line: 10,
      column: 5,
      snippet: 'const x = ;',
    },
  });

  describe('formatErrorForConsole', () => {
    it('should format basic error with default options', () => {
      const formatted = formatErrorForConsole(sampleError);

      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
      expect(formatted).toContain('balm.config.js');
      expect(formatted).toContain('💥'); // Fatal error icon
    });

    it('should format error without colors when disabled', () => {
      const formatted = formatErrorForConsole(sampleError, { colors: false });

      expect(formatted).not.toContain('\x1b['); // No ANSI codes
      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
    });

    it('should format error without icons when disabled', () => {
      const formatted = formatErrorForConsole(sampleError, { icons: false });

      expect(formatted).not.toContain('💥');
      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
    });

    it('should include location information', () => {
      const formatted = formatErrorForConsole(compilationError);

      expect(formatted).toContain('/src/index.js:10:5');
      expect(formatted).toContain('const x = ;');
    });

    it('should include solutions when available', () => {
      const formatted = formatErrorForConsole(sampleError, { includeSolutions: true });

      expect(formatted).toContain('💡 Possible solutions:');
      expect(formatted).toContain('1.');
    });

    it('should include documentation links when available', () => {
      const formatted = formatErrorForConsole(sampleError, { includeDocs: true });

      expect(formatted).toContain('📚 Documentation:');
      expect(formatted).toContain('https://');
    });

    it('should wrap text when maxWidth is specified', () => {
      const formatted = formatErrorForConsole(sampleError, { maxWidth: 40 });
      const lines = formatted.split('\n');

      // Check that no line exceeds the max width (accounting for indentation)
      lines.forEach(line => {
        if (line.trim().length > 0) {
          expect(line.length).toBeLessThanOrEqual(50); // Some tolerance for formatting
        }
      });
    });

    it('should include metadata when enabled', () => {
      const errorWithMetadata = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' }, {
        metadata: { customData: 'test value' },
      });

      const formatted = formatErrorForConsole(errorWithMetadata, { includeMetadata: true });

      expect(formatted).toContain('Additional information:');
      expect(formatted).toContain('customData: test value');
    });
  });

  describe('formatErrorForJSON', () => {
    it('should format error as valid JSON', () => {
      const formatted = formatErrorForJSON(sampleError);
      const parsed = JSON.parse(formatted);

      expect(parsed.code).toBe('CONFIG-SYNTAX-001');
      expect(parsed.message).toContain('balm.config.js');
      expect(parsed.severity).toBe(ErrorSeverity.FATAL);
    });

    it('should include all error properties', () => {
      const formatted = formatErrorForJSON(compilationError);
      const parsed = JSON.parse(formatted);

      expect(parsed.location).toBeDefined();
      expect(parsed.location.filePath).toBe('/src/index.js');
      expect(parsed.location.line).toBe(10);
      expect(parsed.location.column).toBe(5);
    });
  });

  describe('formatErrorForText', () => {
    it('should format error as plain text without colors or icons', () => {
      const formatted = formatErrorForText(sampleError);

      expect(formatted).not.toContain('\x1b['); // No ANSI codes
      expect(formatted).not.toContain('💥'); // No icons
      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
      expect(formatted).toContain('balm.config.js');
    });
  });

  describe('formatErrorForHTML', () => {
    it('should format error as HTML', () => {
      const formatted = formatErrorForHTML(sampleError);

      expect(formatted).toContain('<div class="balm-error error-fatal">');
      expect(formatted).toContain('<span class="error-code">[CONFIG-SYNTAX-001]</span>');
      expect(formatted).toContain('balm.config.js');
      expect(formatted).toContain('</div>');
    });

    it('should escape HTML characters', () => {
      const errorWithHtml = createBalmError('CONFIG-SYNTAX-001', { file: '<script>alert("xss")</script>' });
      const formatted = formatErrorForHTML(errorWithHtml);

      expect(formatted).toContain('&lt;script&gt;');
      expect(formatted).not.toContain('<script>alert');
    });

    it('should include solutions as ordered list', () => {
      const formatted = formatErrorForHTML(sampleError);

      expect(formatted).toContain('<h4>Possible solutions:</h4>');
      expect(formatted).toContain('<ol>');
      expect(formatted).toContain('<li>');
    });

    it('should include documentation as links', () => {
      const formatted = formatErrorForHTML(sampleError);

      expect(formatted).toContain('<h4>Documentation:</h4>');
      expect(formatted).toContain('<a href=');
      expect(formatted).toContain('target="_blank"');
    });
  });

  describe('formatErrors', () => {
    const errors = [
      sampleError,
      compilationError,
      createBalmError('CONFIG-DEPRECATED-001', { property: 'oldProp' }),
    ];

    it('should format multiple errors with summary', () => {
      const formatted = formatErrors(errors);

      expect(formatted).toContain('Found');
      expect(formatted).toContain('fatal');
      expect(formatted).toContain('errors');
      expect(formatted).toContain('warnings');
      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
      expect(formatted).toContain('[COMPILATION-SYNTAX-001]');
      expect(formatted).toContain('[CONFIG-DEPRECATED-001]');
    });

    it('should handle empty error array', () => {
      const formatted = formatErrors([]);

      expect(formatted).toBe('No errors to display.');
    });

    it('should separate errors with dividers', () => {
      const formatted = formatErrors(errors);

      expect(formatted).toContain('─'.repeat(80));
    });
  });

  describe('formatErrorSummary', () => {
    it('should format summary with no errors', () => {
      const summary = { total: 0, fatal: 0, errors: 0, warnings: 0, info: 0 };
      const formatted = formatErrorSummary(summary);

      expect(formatted).toContain('✅ No errors found!');
    });

    it('should format summary with errors', () => {
      const summary = { total: 5, fatal: 1, errors: 2, warnings: 2, info: 0 };
      const formatted = formatErrorSummary(summary);

      expect(formatted).toContain('❌');
      expect(formatted).toContain('1 fatal');
      expect(formatted).toContain('2 errors');
      expect(formatted).toContain('2 warnings');
    });

    it('should format summary with only warnings', () => {
      const summary = { total: 2, fatal: 0, errors: 0, warnings: 2, info: 0 };
      const formatted = formatErrorSummary(summary);

      expect(formatted).toContain('⚠️');
      expect(formatted).toContain('2 warnings');
      expect(formatted).not.toContain('fatal');
      expect(formatted).not.toContain('errors');
    });

    it('should format summary without colors when disabled', () => {
      const summary = { total: 1, fatal: 0, errors: 1, warnings: 0, info: 0 };
      const formatted = formatErrorSummary(summary, { colors: false });

      expect(formatted).not.toContain('\x1b['); // No ANSI codes
      expect(formatted).toContain('1 errors');
    });
  });

  describe('formatError', () => {
    it('should format error for console by default', () => {
      const formatted = formatError(sampleError);

      expect(formatted).toContain('💥');
      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
    });

    it('should format error for JSON when specified', () => {
      const formatted = formatError(sampleError, 'json');
      const parsed = JSON.parse(formatted);

      expect(parsed.code).toBe('CONFIG-SYNTAX-001');
    });

    it('should format error for text when specified', () => {
      const formatted = formatError(sampleError, 'text');

      expect(formatted).not.toContain('💥');
      expect(formatted).not.toContain('\x1b[');
      expect(formatted).toContain('[CONFIG-SYNTAX-001]');
    });

    it('should format error for HTML when specified', () => {
      const formatted = formatError(sampleError, 'html');

      expect(formatted).toContain('<div class="balm-error');
      expect(formatted).toContain('</div>');
    });
  });

  describe('severity icons and colors', () => {
    it('should use correct icon for each severity', () => {
      const fatal = createBalmError('CONFIG-SYNTAX-001', { file: 'test.js' });
      const error = createBalmError('CONFIG-VALUE-001', { property: 'test', value: 'invalid', expected: 'string' });
      const warning = createBalmError('CONFIG-DEPRECATED-001', { property: 'old' });

      expect(formatErrorForConsole(fatal)).toContain('💥');
      expect(formatErrorForConsole(error)).toContain('❌');
      expect(formatErrorForConsole(warning)).toContain('⚠️');
    });
  });
});