/**
 * Regression tests for SWC compiler
 * Ensures functionality remains consistent across updates
 */

import { SWCCompiler } from '../index.js';
import { SWCConfigMapper } from '../config.js';
import { CompilerOptions } from '../../base.js';

describe('SWC Regression Tests', () => {
  describe('JavaScript Compilation', () => {
    let compiler: SWCCompiler;

    beforeEach(() => {
      compiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
        sourceMap: true,
      });
    });

    it('should handle arrow functions correctly', async () => {
      const code = `
        const add = (a, b) => a + b;
        const multiply = (x, y) => {
          return x * y;
        };
        export { add, multiply };
      `;

      const result = await compiler.transform(code, 'arrow-functions.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('add');
      expect(result.code).toContain('multiply');
      expect(result.code).toMatch(/export.*{.*add.*multiply.*}/);
    });

    it('should handle destructuring assignment', async () => {
      const code = `
        const obj = { a: 1, b: 2, c: 3 };
        const { a, b, ...rest } = obj;
        const arr = [1, 2, 3, 4, 5];
        const [first, second, ...remaining] = arr;
        export { a, b, rest, first, second, remaining };
      `;

      const result = await compiler.transform(code, 'destructuring.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('obj');
      expect(result.code).toContain('arr');
    });

    it('should handle template literals', async () => {
      const code = `
        const name = 'World';
        const greeting = \`Hello, \${name}!\`;
        const multiline = \`
          This is a
          multiline string
          with \${name}
        \`;
        export { greeting, multiline };
      `;

      const result = await compiler.transform(code, 'template-literals.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('name');
      expect(result.code).toContain('greeting');
      expect(result.code).toContain('multiline');
    });

    it('should handle async/await', async () => {
      const code = `
        async function fetchData(url) {
          try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
          }
        }
        
        const getData = async () => {
          const result = await fetchData('/api/data');
          return result;
        };
        
        export { fetchData, getData };
      `;

      const result = await compiler.transform(code, 'async-await.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('fetchData');
      expect(result.code).toContain('getData');
    });

    it('should handle classes with methods', async () => {
      const code = `
        class Calculator {
          constructor(initialValue = 0) {
            this.value = initialValue;
          }
          
          add(num) {
            this.value += num;
            return this;
          }
          
          multiply(num) {
            this.value *= num;
            return this;
          }
          
          get result() {
            return this.value;
          }
          
          static create(value) {
            return new Calculator(value);
          }
        }
        
        export default Calculator;
      `;

      const result = await compiler.transform(code, 'calculator.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('Calculator');
      expect(result.code).toContain('constructor');
      expect(result.code).toContain('add');
      expect(result.code).toContain('multiply');
    });
  });

  describe('JSX Compilation', () => {
    let jsxCompiler: SWCCompiler;

    beforeEach(() => {
      jsxCompiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
        jsx: 'react-jsx',
        sourceMap: true,
      });
    });

    it('should transform JSX elements', async () => {
      const code = `
        import React from 'react';
        
        const Button = ({ children, onClick }) => {
          return <button onClick={onClick}>{children}</button>;
        };
        
        export default Button;
      `;

      const result = await jsxCompiler.transform(code, 'button.jsx');
      
      expect(result.code).toBeTruthy();
      expect(result.code).not.toContain('<button');
      expect(result.code).not.toContain('</button>');
      // Should contain React element creation
      expect(result.code).toMatch(/jsx|createElement/);
    });

    it('should handle JSX fragments', async () => {
      const code = `
        import React from 'react';
        
        const List = ({ items }) => {
          return (
            <>
              <h1>Items</h1>
              {items.map(item => (
                <div key={item.id}>{item.name}</div>
              ))}
            </>
          );
        };
        
        export default List;
      `;

      const result = await jsxCompiler.transform(code, 'list.jsx');
      
      expect(result.code).toBeTruthy();
      expect(result.code).not.toContain('<>');
      expect(result.code).not.toContain('</>');
    });

    it('should handle JSX with props spreading', async () => {
      const code = `
        import React from 'react';
        
        const Input = ({ label, ...inputProps }) => {
          return (
            <div>
              <label>{label}</label>
              <input {...inputProps} />
            </div>
          );
        };
        
        export default Input;
      `;

      const result = await jsxCompiler.transform(code, 'input.jsx');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('inputProps');
    });
  });

  describe('TypeScript Compilation', () => {
    let tsCompiler: SWCCompiler;

    beforeEach(() => {
      tsCompiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
        sourceMap: true,
      });
    });

    it('should compile TypeScript interfaces', async () => {
      const code = `
        interface User {
          id: number;
          name: string;
          email?: string;
        }
        
        interface UserRepository {
          findById(id: number): Promise<User | null>;
          create(user: Omit<User, 'id'>): Promise<User>;
        }
        
        class InMemoryUserRepository implements UserRepository {
          private users: Map<number, User> = new Map();
          
          async findById(id: number): Promise<User | null> {
            return this.users.get(id) || null;
          }
          
          async create(userData: Omit<User, 'id'>): Promise<User> {
            const id = Date.now();
            const user: User = { id, ...userData };
            this.users.set(id, user);
            return user;
          }
        }
        
        export { User, UserRepository, InMemoryUserRepository };
      `;

      const result = await tsCompiler.transform(code, 'user-repository.ts');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('InMemoryUserRepository');
      expect(result.code).toContain('findById');
      expect(result.code).toContain('create');
      // Interfaces should be removed
      expect(result.code).not.toContain('interface User');
      expect(result.code).not.toContain('interface UserRepository');
    });

    it('should handle TypeScript generics', async () => {
      const code = `
        class Container<T> {
          private items: T[] = [];
          
          add(item: T): void {
            this.items.push(item);
          }
          
          get(index: number): T | undefined {
            return this.items[index];
          }
          
          getAll(): T[] {
            return [...this.items];
          }
        }
        
        function identity<T>(arg: T): T {
          return arg;
        }
        
        export { Container, identity };
      `;

      const result = await tsCompiler.transform(code, 'generics.ts');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('Container');
      expect(result.code).toContain('identity');
      // Generic type parameters should be removed
      expect(result.code).not.toContain('<T>');
    });

    it('should handle TypeScript enums', async () => {
      const code = `
        enum Status {
          Pending = 'pending',
          Approved = 'approved',
          Rejected = 'rejected'
        }
        
        enum Priority {
          Low = 1,
          Medium,
          High
        }
        
        interface Task {
          id: number;
          status: Status;
          priority: Priority;
        }
        
        export { Status, Priority, Task };
      `;

      const result = await tsCompiler.transform(code, 'enums.ts');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('Status');
      expect(result.code).toContain('Priority');
      expect(result.code).toContain('pending');
      expect(result.code).toContain('approved');
    });
  });

  describe('Modern JavaScript Features', () => {
    let modernCompiler: SWCCompiler;

    beforeEach(() => {
      modernCompiler = new SWCCompiler({
        target: 'es2022',
        module: 'es6',
        sourceMap: true,
      });
    });

    it('should handle optional chaining', async () => {
      const code = `
        const user = {
          profile: {
            address: {
              street: '123 Main St'
            }
          }
        };
        
        const street = user?.profile?.address?.street;
        const phone = user?.profile?.contact?.phone ?? 'No phone';
        
        export { street, phone };
      `;

      const result = await modernCompiler.transform(code, 'optional-chaining.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('street');
      expect(result.code).toContain('phone');
    });

    it('should handle nullish coalescing', async () => {
      const code = `
        function processValue(value) {
          const processed = value ?? 'default';
          const config = {
            theme: value?.theme ?? 'light',
            debug: value?.debug ?? false
          };
          return { processed, config };
        }
        
        export { processValue };
      `;

      const result = await modernCompiler.transform(code, 'nullish-coalescing.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('processValue');
    });

    it('should handle logical assignment operators', async () => {
      const code = `
        let config = {};
        config.theme ??= 'dark';
        config.debug ||= false;
        config.features &&= { ...config.features, newFeature: true };
        
        export { config };
      `;

      const result = await modernCompiler.transform(code, 'logical-assignment.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('config');
    });

    it('should handle numeric separators', async () => {
      const code = `
        const million = 1_000_000;
        const binary = 0b1010_0001;
        const hex = 0xFF_EC_DE_5E;
        const decimal = 123.456_789;
        
        export { million, binary, hex, decimal };
      `;

      const result = await modernCompiler.transform(code, 'numeric-separators.js');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('million');
      expect(result.code).toContain('binary');
      expect(result.code).toContain('hex');
      expect(result.code).toContain('decimal');
    });
  });

  describe('Error Handling', () => {
    let compiler: SWCCompiler;

    beforeEach(() => {
      compiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
      });
    });

    it('should provide meaningful error messages for syntax errors', async () => {
      const invalidCode = 'const x = {';

      await expect(
        compiler.transform(invalidCode, 'invalid.js')
      ).rejects.toThrow(/SWC transform failed/);
    });

    it('should handle empty files', async () => {
      const result = await compiler.transform('', 'empty.js');
      
      expect(result.code).toBeDefined();
      expect(typeof result.code).toBe('string');
    });

    it('should handle files with only comments', async () => {
      const code = `
        // This is a comment
        /* This is a block comment */
      `;

      const result = await compiler.transform(code, 'comments-only.js');
      
      expect(result.code).toBeDefined();
      expect(typeof result.code).toBe('string');
    });
  });

  describe('Configuration Consistency', () => {
    it('should maintain consistent behavior across different configurations', async () => {
      const code = `
        const add = (a, b) => a + b;
        export default add;
      `;

      const configs = [
        { target: 'es5', module: 'commonjs' },
        { target: 'es2015', module: 'es6' },
        { target: 'es2020', module: 'es6' },
        { target: 'es2022', module: 'es6' },
      ];

      for (const config of configs) {
        const compiler = new SWCCompiler(config as CompilerOptions);
        const result = await compiler.transform(code, 'test.js');
        
        expect(result.code).toBeTruthy();
        expect(result.code).toContain('add');
      }
    });

    it('should handle different JSX configurations', async () => {
      const jsxCode = `
        const Button = () => <button>Click me</button>;
        export default Button;
      `;

      const jsxConfigs = [
        { jsx: 'preserve' },
        { jsx: 'react' },
        { jsx: 'react-jsx' },
      ];

      for (const config of jsxConfigs) {
        const compiler = new SWCCompiler(config as CompilerOptions);
        const result = await compiler.transform(jsxCode, 'button.jsx');
        
        expect(result.code).toBeTruthy();
        expect(result.code).toContain('Button');
      }
    });
  });

  describe('Source Maps', () => {
    it('should generate source maps when enabled', async () => {
      const compiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
        sourceMap: true,
      });

      const code = `
        const greeting = 'Hello, World!';
        console.log(greeting);
      `;

      const result = await compiler.transform(code, 'greeting.js');
      
      expect(result.code).toBeTruthy();
      expect(result.map).toBeTruthy();
      
      if (result.map) {
        const sourceMap = JSON.parse(result.map);
        expect(sourceMap.version).toBe(3);
        expect(sourceMap.sources).toBeDefined();
        expect(sourceMap.mappings).toBeDefined();
      }
    });

    it('should not generate source maps when disabled', async () => {
      const compiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
        sourceMap: false,
      });

      const code = `
        const greeting = 'Hello, World!';
        console.log(greeting);
      `;

      const result = await compiler.transform(code, 'greeting.js');
      
      expect(result.code).toBeTruthy();
      expect(result.map).toBeUndefined();
    });
  });

  describe('Integration with Config System', () => {
    it('should work correctly with SWCConfigMapper', async () => {
      const balmConfig = {
        compiler: {
          type: 'swc' as const,
          options: {
            target: 'es2020' as const,
            module: 'es6' as const,
            jsx: 'react-jsx' as const,
          },
        },
        target: {
          esVersion: 'es2020' as const,
          browsers: ['defaults'],
        },
        features: {
          hmr: true,
          splitting: true,
          treeshaking: true,
          minification: false,
          sourceMap: true,
          cssExtraction: false,
          polyfillInjection: true,
          modernSyntax: true,
        },
      };

      const swcOptions = SWCConfigMapper.mapBalmConfigToSWC(
        balmConfig,
        balmConfig.compiler.options
      );

      const compiler = new SWCCompiler(balmConfig.compiler.options);
      compiler.updateSWCOptions(swcOptions);

      const code = `
        import React from 'react';
        const App = () => <div>Hello World</div>;
        export default App;
      `;

      const result = await compiler.transform(code, 'app.jsx');
      
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('App');
      expect(result.code).not.toContain('<div>');
    });
  });
});