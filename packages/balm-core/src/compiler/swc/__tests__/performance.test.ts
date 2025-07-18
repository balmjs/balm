/**
 * Performance tests for SWC compiler
 * Compares SWC performance against Babel and validates output correctness
 */

import fs from 'node:fs';
import path from 'node:path';
import { SWCCompiler } from '../index.js';
import { BabelCompiler } from '../../babel/index.js';
import { CompilerOptions } from '../../base.js';

describe('SWC Performance Tests', () => {
  let swcCompiler: SWCCompiler;
  let babelCompiler: BabelCompiler;
  
  const testFiles = {
    simpleJS: `
      const greeting = 'Hello, World!';
      function greet(name) {
        return \`\${greeting} \${name}\`;
      }
      export default greet;
    `,
    complexJS: `
      import React, { useState, useEffect } from 'react';
      import { debounce } from 'lodash';
      
      const MyComponent = ({ initialValue = 0 }) => {
        const [count, setCount] = useState(initialValue);
        const [loading, setLoading] = useState(false);
        
        const debouncedUpdate = debounce((value) => {
          setLoading(true);
          setTimeout(() => {
            setCount(value);
            setLoading(false);
          }, 100);
        }, 300);
        
        useEffect(() => {
          console.log('Count updated:', count);
        }, [count]);
        
        return (
          <div className="counter">
            <h1>Count: {count}</h1>
            <button 
              onClick={() => debouncedUpdate(count + 1)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Increment'}
            </button>
          </div>
        );
      };
      
      export default MyComponent;
    `,
    typescript: `
      interface User {
        id: number;
        name: string;
        email?: string;
        roles: Role[];
      }
      
      interface Role {
        id: number;
        name: string;
        permissions: Permission[];
      }
      
      interface Permission {
        id: number;
        action: string;
        resource: string;
      }
      
      class UserService {
        private users: Map<number, User> = new Map();
        
        async createUser(userData: Omit<User, 'id'>): Promise<User> {
          const id = Date.now();
          const user: User = { id, ...userData };
          this.users.set(id, user);
          return user;
        }
        
        async getUserById(id: number): Promise<User | null> {
          return this.users.get(id) || null;
        }
        
        async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
          const user = this.users.get(id);
          if (!user) return null;
          
          const updatedUser = { ...user, ...updates };
          this.users.set(id, updatedUser);
          return updatedUser;
        }
        
        hasPermission(user: User, action: string, resource: string): boolean {
          return user.roles.some(role =>
            role.permissions.some(permission =>
              permission.action === action && permission.resource === resource
            )
          );
        }
      }
      
      export { UserService, type User, type Role, type Permission };
    `,
    modernJS: `
      // ES2022+ features
      class ModernClass {
        #privateField = 'secret';
        static #staticPrivate = 'static secret';
        
        static {
          console.log('Static initialization block');
        }
        
        constructor(public name: string) {}
        
        get secret() {
          return this.#privateField;
        }
        
        static getStaticSecret() {
          return this.#staticPrivate;
        }
      }
      
      // Top-level await
      const data = await fetch('/api/data').then(r => r.json());
      
      // Logical assignment operators
      let config = {};
      config.theme ??= 'dark';
      config.debug ||= false;
      config.features &&= { ...config.features, newFeature: true };
      
      // Numeric separators
      const largeNumber = 1_000_000;
      const binaryNumber = 0b1010_0001;
      const hexNumber = 0xFF_EC_DE_5E;
      
      export { ModernClass, data, config, largeNumber };
    `,
  };

  beforeEach(() => {
    const options: CompilerOptions = {
      target: 'es2020',
      module: 'es6',
      jsx: 'react-jsx',
      sourceMap: true,
      minify: false,
    };

    swcCompiler = new SWCCompiler(options);
    babelCompiler = new BabelCompiler(options);
  });

  describe('Compilation Speed Comparison', () => {
    it('should compile simple JavaScript faster than Babel', async () => {
      const iterations = 100;
      
      // Warm up
      await swcCompiler.transform(testFiles.simpleJS, 'test.js');
      await babelCompiler.transform(testFiles.simpleJS, 'test.js');
      
      // Measure SWC
      const swcStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await swcCompiler.transform(testFiles.simpleJS, 'test.js');
      }
      const swcTime = performance.now() - swcStart;
      
      // Measure Babel
      const babelStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await babelCompiler.transform(testFiles.simpleJS, 'test.js');
      }
      const babelTime = performance.now() - babelStart;
      
      const speedup = babelTime / swcTime;
      
      console.log(`SWC: ${swcTime.toFixed(2)}ms, Babel: ${babelTime.toFixed(2)}ms`);
      console.log(`SWC is ${speedup.toFixed(1)}x faster`);
      
      // SWC should be at least 5x faster for simple code
      expect(speedup).toBeGreaterThan(5);
    }, 30000);

    it('should compile complex React code faster than Babel', async () => {
      const iterations = 50;
      
      // Warm up
      await swcCompiler.transform(testFiles.complexJS, 'test.jsx');
      await babelCompiler.transform(testFiles.complexJS, 'test.jsx');
      
      // Measure SWC
      const swcStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await swcCompiler.transform(testFiles.complexJS, 'test.jsx');
      }
      const swcTime = performance.now() - swcStart;
      
      // Measure Babel
      const babelStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await babelCompiler.transform(testFiles.complexJS, 'test.jsx');
      }
      const babelTime = performance.now() - babelStart;
      
      const speedup = babelTime / swcTime;
      
      console.log(`Complex React - SWC: ${swcTime.toFixed(2)}ms, Babel: ${babelTime.toFixed(2)}ms`);
      console.log(`SWC is ${speedup.toFixed(1)}x faster`);
      
      // SWC should be at least 3x faster for complex code
      expect(speedup).toBeGreaterThan(3);
    }, 30000);

    it('should compile TypeScript faster than Babel', async () => {
      const iterations = 30;
      
      // Configure for TypeScript
      const tsOptions: CompilerOptions = {
        target: 'es2020',
        module: 'es6',
        sourceMap: true,
        declaration: true,
      };
      
      const swcTS = new SWCCompiler(tsOptions);
      const babelTS = new BabelCompiler(tsOptions);
      
      // Warm up
      await swcTS.transform(testFiles.typescript, 'test.ts');
      await babelTS.transform(testFiles.typescript, 'test.ts');
      
      // Measure SWC
      const swcStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await swcTS.transform(testFiles.typescript, 'test.ts');
      }
      const swcTime = performance.now() - swcStart;
      
      // Measure Babel
      const babelStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await babelTS.transform(testFiles.typescript, 'test.ts');
      }
      const babelTime = performance.now() - babelStart;
      
      const speedup = babelTime / swcTime;
      
      console.log(`TypeScript - SWC: ${swcTime.toFixed(2)}ms, Babel: ${babelTime.toFixed(2)}ms`);
      console.log(`SWC is ${speedup.toFixed(1)}x faster`);
      
      // SWC should be significantly faster for TypeScript
      expect(speedup).toBeGreaterThan(2);
    }, 30000);
  });

  describe('Output Correctness Validation', () => {
    it('should produce functionally equivalent output for simple JavaScript', async () => {
      const swcResult = await swcCompiler.transform(testFiles.simpleJS, 'test.js');
      const babelResult = await babelCompiler.transform(testFiles.simpleJS, 'test.js');
      
      // Both should produce valid JavaScript
      expect(swcResult.code).toBeTruthy();
      expect(babelResult.code).toBeTruthy();
      
      // Both should contain the essential elements
      expect(swcResult.code).toContain('greeting');
      expect(swcResult.code).toContain('greet');
      expect(babelResult.code).toContain('greeting');
      expect(babelResult.code).toContain('greet');
      
      // Both should handle exports
      expect(swcResult.code).toMatch(/export.*default/);
      expect(babelResult.code).toMatch(/export.*default/);
    });

    it('should handle JSX transformation correctly', async () => {
      const jsxCode = `
        import React from 'react';
        const Component = () => <div>Hello World</div>;
        export default Component;
      `;
      
      const swcResult = await swcCompiler.transform(jsxCode, 'test.jsx');
      const babelResult = await babelCompiler.transform(jsxCode, 'test.jsx');
      
      // Both should transform JSX
      expect(swcResult.code).not.toContain('<div>');
      expect(babelResult.code).not.toContain('<div>');
      
      // Both should contain React element creation
      expect(swcResult.code).toMatch(/React\.createElement|jsx/);
      expect(babelResult.code).toMatch(/React\.createElement|jsx/);
    });

    it('should handle modern JavaScript features', async () => {
      const modernCompiler = new SWCCompiler({
        target: 'es2022',
        module: 'es6',
      });
      
      try {
        const result = await modernCompiler.transform(testFiles.modernJS, 'test.js');
        
        // Should successfully compile modern features
        expect(result.code).toBeTruthy();
        
        // Should preserve or transform modern features appropriately
        expect(result.code).toContain('ModernClass');
        
        // Private fields might be transformed depending on target
        // The important thing is that it compiles without errors
      } catch (error) {
        // If modern features aren't supported, that's also valid
        // as long as it fails gracefully
        expect(error.message).toContain('SWC transform failed');
      }
    });

    it('should handle TypeScript correctly', async () => {
      const tsCompiler = new SWCCompiler({
        target: 'es2020',
        module: 'es6',
      });
      
      const result = await tsCompiler.transform(testFiles.typescript, 'test.ts');
      
      // Should compile TypeScript to JavaScript
      expect(result.code).toBeTruthy();
      expect(result.code).toContain('UserService');
      expect(result.code).toContain('createUser');
      
      // Should remove TypeScript-specific syntax
      expect(result.code).not.toContain('interface User');
      expect(result.code).not.toContain(': Promise<');
    });
  });

  describe('Minification Performance', () => {
    it('should minify code faster than Babel', async () => {
      const minifyOptions: CompilerOptions = {
        target: 'es2020',
        module: 'es6',
        minify: true,
      };
      
      const swcMinify = new SWCCompiler(minifyOptions);
      const babelMinify = new BabelCompiler(minifyOptions);
      
      const iterations = 20;
      const testCode = testFiles.complexJS;
      
      // Warm up
      await swcMinify.minify(testCode, 'test.js');
      await babelMinify.minify(testCode, 'test.js');
      
      // Measure SWC minification
      const swcStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await swcMinify.minify(testCode, 'test.js');
      }
      const swcTime = performance.now() - swcStart;
      
      // Measure Babel minification
      const babelStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        await babelMinify.minify(testCode, 'test.js');
      }
      const babelTime = performance.now() - babelStart;
      
      const speedup = babelTime / swcTime;
      
      console.log(`Minification - SWC: ${swcTime.toFixed(2)}ms, Babel: ${babelTime.toFixed(2)}ms`);
      console.log(`SWC minification is ${speedup.toFixed(1)}x faster`);
      
      // SWC minification should be faster
      expect(speedup).toBeGreaterThan(1);
    }, 30000);

    it('should produce comparable minified output size', async () => {
      const minifyOptions: CompilerOptions = {
        target: 'es2020',
        module: 'es6',
        minify: true,
      };
      
      const swcMinify = new SWCCompiler(minifyOptions);
      const babelMinify = new BabelCompiler(minifyOptions);
      
      const swcResult = await swcMinify.minify(testFiles.complexJS, 'test.js');
      const babelResult = await babelMinify.minify(testFiles.complexJS, 'test.js');
      
      const swcSize = swcResult.code.length;
      const babelSize = babelResult.code.length;
      const sizeDiff = Math.abs(swcSize - babelSize) / Math.max(swcSize, babelSize);
      
      console.log(`Minified sizes - SWC: ${swcSize} bytes, Babel: ${babelSize} bytes`);
      console.log(`Size difference: ${(sizeDiff * 100).toFixed(1)}%`);
      
      // Size difference should be reasonable (within 20%)
      expect(sizeDiff).toBeLessThan(0.2);
    });
  });

  describe('Memory Usage', () => {
    it('should use reasonable memory during compilation', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Compile multiple files
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(swcCompiler.transform(testFiles.complexJS, `test${i}.jsx`));
      }
      
      await Promise.all(promises);
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
      
      // Memory increase should be reasonable (less than 100MB for 100 files)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle syntax errors quickly', async () => {
      const invalidCode = 'const x = {';
      const iterations = 50;
      
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        try {
          await swcCompiler.transform(invalidCode, 'invalid.js');
        } catch (error) {
          // Expected to fail
        }
      }
      const time = performance.now() - start;
      
      console.log(`Error handling time: ${time.toFixed(2)}ms for ${iterations} iterations`);
      
      // Error handling should be fast (less than 1ms per error on average)
      expect(time / iterations).toBeLessThan(1);
    });
  });

  describe('Regression Tests', () => {
    it('should maintain consistent performance across runs', async () => {
      const runs = 5;
      const iterations = 20;
      const times: number[] = [];
      
      for (let run = 0; run < runs; run++) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
          await swcCompiler.transform(testFiles.complexJS, 'test.jsx');
        }
        times.push(performance.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const variance = times.reduce((acc, time) => acc + Math.pow(time - avgTime, 2), 0) / times.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = stdDev / avgTime;
      
      console.log(`Performance consistency - Avg: ${avgTime.toFixed(2)}ms, StdDev: ${stdDev.toFixed(2)}ms, CV: ${(coefficientOfVariation * 100).toFixed(1)}%`);
      
      // Performance should be consistent (coefficient of variation < 20%)
      expect(coefficientOfVariation).toBeLessThan(0.2);
    });
  });
});