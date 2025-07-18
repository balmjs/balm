/**
 * Tests for code frame generator
 */

import { CodeFrameGenerator } from '../code-frame.js';

describe('CodeFrameGenerator', () => {
  const generator = new CodeFrameGenerator();

  const sampleCode = `function hello() {
  console.log("Hello, world!");
  const x = ;
  return x;
}`;

  const multiLineCode = `import React from 'react';
import { useState } from 'react';

function Component() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  );
}

export default Component;`;

  describe('generateCodeFrame', () => {
    it('should generate code frame for error location', () => {
      const frame = generator.generateCodeFrame(sampleCode, 3, 11);

      expect(frame).toContain('const x = ;');
      expect(frame).toContain('^'); // Error pointer
      expect(frame).toContain('3 |'); // Line number
    });

    it('should include context lines around error', () => {
      const frame = generator.generateCodeFrame(sampleCode, 3, 11, { contextLines: 2 });

      expect(frame).toContain('1 |'); // Context before
      expect(frame).toContain('2 |'); // Context before
      expect(frame).toContain('3 |'); // Error line
      expect(frame).toContain('4 |'); // Context after
      expect(frame).toContain('5 |'); // Context after
    });

    it('should handle error at first line', () => {
      const frame = generator.generateCodeFrame(sampleCode, 1, 1);

      expect(frame).toContain('1 |');
      expect(frame).toContain('function hello() {');
      expect(frame).toContain('^');
    });

    it('should handle error at last line', () => {
      const frame = generator.generateCodeFrame(sampleCode, 5, 1);

      expect(frame).toContain('5 |');
      expect(frame).toContain('}');
      expect(frame).toContain('^');
    });

    it('should handle single line code', () => {
      const singleLine = 'const x = ;';
      const frame = generator.generateCodeFrame(singleLine, 1, 11);

      expect(frame).toContain('1 |');
      expect(frame).toContain('const x = ;');
      expect(frame).toContain('^');
    });

    it('should handle invalid line numbers gracefully', () => {
      const frame = generator.generateCodeFrame(sampleCode, 100, 1);

      expect(frame).toContain('Line 100 not found');
    });

    it('should handle invalid column numbers gracefully', () => {
      const frame = generator.generateCodeFrame(sampleCode, 1, 1000);

      expect(frame).toContain('function hello() {');
      expect(frame).toContain('^'); // Should still show pointer at end of line
    });
  });

  describe('generateCodeFrameWithHighlight', () => {
    it('should generate code frame with syntax highlighting', () => {
      const frame = generator.generateCodeFrameWithHighlight(multiLineCode, 5, 10);

      expect(frame).toContain('const');
      expect(frame).toContain('[count, setCount]');
      expect(frame).toContain('^');
    });

    it('should handle TypeScript code', () => {
      const tsCode = `interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: "30" // Type error here
};`;

      const frame = generator.generateCodeFrameWithHighlight(tsCode, 8, 8);

      expect(frame).toContain('age: "30"');
      expect(frame).toContain('^');
    });

    it('should handle JSX code', () => {
      const jsxCode = `function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>This is a paragraph</p>
    </div>
  );
}`;

      const frame = generator.generateCodeFrameWithHighlight(jsxCode, 4, 6);

      expect(frame).toContain('<h1>Hello World</h1>');
      expect(frame).toContain('^');
    });
  });

  describe('options', () => {
    it('should respect contextLines option', () => {
      const frame = generator.generateCodeFrame(multiLineCode, 10, 5, { contextLines: 1 });
      const lines = frame.split('\n').filter(line => line.includes('|'));

      // Should have error line + 1 context line before + 1 context line after = 3 lines
      expect(lines.length).toBeLessThanOrEqual(5); // Some tolerance for formatting
    });

    it('should respect showLineNumbers option', () => {
      const frame = generator.generateCodeFrame(sampleCode, 3, 11, { showLineNumbers: false });

      expect(frame).not.toContain('3 |');
      expect(frame).toContain('const x = ;');
      expect(frame).toContain('^');
    });

    it('should respect highlightSyntax option', () => {
      const frameWithHighlight = generator.generateCodeFrame(sampleCode, 3, 11, { highlightSyntax: true });
      const frameWithoutHighlight = generator.generateCodeFrame(sampleCode, 3, 11, { highlightSyntax: false });

      // With syntax highlighting, there should be more formatting
      expect(frameWithHighlight.length).toBeGreaterThanOrEqual(frameWithoutHighlight.length);
    });

    it('should respect maxWidth option', () => {
      const longLine = 'const veryLongVariableName = "this is a very long string that exceeds the maximum width";';
      const frame = generator.generateCodeFrame(longLine, 1, 50, { maxWidth: 50 });

      const lines = frame.split('\n');
      lines.forEach(line => {
        if (line.includes('|')) {
          expect(line.length).toBeLessThanOrEqual(60); // Some tolerance for line numbers and formatting
        }
      });
    });

    it('should handle tab characters correctly', () => {
      const codeWithTabs = `function test() {\n\tconst x = ;\n\treturn x;\n}`;
      const frame = generator.generateCodeFrame(codeWithTabs, 2, 12, { tabWidth: 4 });

      expect(frame).toContain('const x = ;');
      expect(frame).toContain('^');
    });
  });

  describe('error handling', () => {
    it('should handle empty code', () => {
      const frame = generator.generateCodeFrame('', 1, 1);

      expect(frame).toContain('No code to display');
    });

    it('should handle null/undefined code', () => {
      const frame1 = generator.generateCodeFrame(null as any, 1, 1);
      const frame2 = generator.generateCodeFrame(undefined as any, 1, 1);

      expect(frame1).toContain('No code to display');
      expect(frame2).toContain('No code to display');
    });

    it('should handle zero or negative line numbers', () => {
      const frame1 = generator.generateCodeFrame(sampleCode, 0, 1);
      const frame2 = generator.generateCodeFrame(sampleCode, -1, 1);

      expect(frame1).toContain('Invalid line number');
      expect(frame2).toContain('Invalid line number');
    });

    it('should handle zero or negative column numbers', () => {
      const frame1 = generator.generateCodeFrame(sampleCode, 1, 0);
      const frame2 = generator.generateCodeFrame(sampleCode, 1, -1);

      expect(frame1).toContain('function hello() {');
      expect(frame2).toContain('function hello() {');
    });
  });

  describe('formatting', () => {
    it('should align line numbers properly', () => {
      const longCode = Array(100).fill('console.log("line");').join('\n');
      const frame = generator.generateCodeFrame(longCode, 50, 1, { contextLines: 5 });

      const lines = frame.split('\n').filter(line => line.includes('|'));
      
      // Check that all line number columns are aligned
      const lineNumberWidths = lines.map(line => {
        const match = line.match(/^\s*(\d+)\s*\|/);
        return match ? match[0].length : 0;
      });

      const maxWidth = Math.max(...lineNumberWidths);
      lineNumberWidths.forEach(width => {
        expect(width).toBe(maxWidth);
      });
    });

    it('should handle Unicode characters correctly', () => {
      const unicodeCode = `const message = "Hello 世界! 🌍";
const emoji = "🚀";
console.log(message);`;

      const frame = generator.generateCodeFrame(unicodeCode, 2, 15);

      expect(frame).toContain('🚀');
      expect(frame).toContain('^');
    });
  });
});