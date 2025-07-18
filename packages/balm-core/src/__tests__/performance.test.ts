/**
 * Performance benchmark tests for BalmJS modernization
 * Tests performance improvements and regressions
 */

import { validateConfig, migrateConfig } from '../config/index.js';
import { ErrorHandler, SuggestionEngine } from '../errors/index.js';
import { ModernBalmConfig } from '../config/types.js';

describe('Performance Benchmarks', () => {
  describe('Configuration Validation Performance', () => {
    it('should validate simple configuration quickly', () => {
      const config: ModernBalmConfig = {
        mode: 'development',
        bundler: 'webpack',
        paths: {
          src: 'src',
          dist: 'dist',
        },
      };

      const iterations = 1000;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        validateConfig(config);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(1); // Should be under 1ms per validation
      console.log(`Simple validation: ${avgTime.toFixed(3)}ms per operation`);
    });

    it('should validate complex configuration efficiently', () => {
      const complexConfig: ModernBalmConfig = {
        mode: 'production',
        bundler: 'webpack',
        paths: {
          src: 'src',
          dist: 'dist',
          public: 'public',
          assets: 'assets',
        },
        devServer: {
          host: 'localhost',
          port: 3000,
          open: true,
          https: false,
          proxy: {
            '/api': 'http://localhost:3001',
            '/auth': 'http://localhost:3002',
            '/uploads': 'http://localhost:3003',
          },
        },
        compiler: {
          primary: 'babel',
          target: 'es2020',
          jsx: true,
          typescript: true,
        },
      };

      const iterations = 500;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        validateConfig(complexConfig);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(2); // Should be under 2ms per validation
      console.log(`Complex validation: ${avgTime.toFixed(3)}ms per operation`);
    });

    it('should handle batch validation efficiently', () => {
      const configs = Array.from({ length: 100 }, (_, i) => ({
        mode: i % 2 === 0 ? 'development' : 'production',
        bundler: ['webpack', 'vite', 'rollup'][i % 3],
        paths: {
          src: `src${i}`,
          dist: `dist${i}`,
        },
        devServer: {
          port: 3000 + i,
        },
      }));

      const startTime = performance.now();
      const results = configs.map(config => validateConfig(config));
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      const avgTime = totalTime / configs.length;

      expect(results.every(r => r.valid)).toBe(true);
      expect(avgTime).toBeLessThan(1); // Should be under 1ms per validation
      expect(totalTime).toBeLessThan(100); // Total should be under 100ms
      
      console.log(`Batch validation (${configs.length} configs): ${avgTime.toFixed(3)}ms per operation, ${totalTime.toFixed(1)}ms total`);
    });
  });

  describe('Configuration Migration Performance', () => {
    it('should migrate simple legacy configuration quickly', () => {
      const legacyConfig = {
        env: 'production',
        roots: {
          source: 'src',
          target: 'dist',
        },
      };

      const iterations = 500;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        migrateConfig(legacyConfig);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(2); // Should be under 2ms per migration
      console.log(`Simple migration: ${avgTime.toFixed(3)}ms per operation`);
    });

    it('should migrate complex legacy configuration efficiently', () => {
      const complexLegacyConfig = {
        production: true,
        roots: {
          source: 'app/src',
          target: 'public/dist',
          assets: 'app/assets',
        },
        server: {
          localOnly: false,
          port: 8080,
          open: true,
          https: false,
          proxyTable: {
            '/api': 'http://localhost:3001',
            '/auth': 'http://localhost:3002',
            '/uploads': 'http://localhost:3003',
            '/static': 'http://localhost:3004',
          },
        },
        scripts: {
          babel: true,
          typescript: true,
          target: 'es2019',
        },
        styles: {
          sass: true,
          postcss: true,
          extract: true,
        },
        useDefault: true,
        legacy: false,
        modernizr: { enabled: false },
        sprites: { enabled: false },
      };

      const iterations = 200;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        migrateConfig(complexLegacyConfig);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;

      expect(avgTime).toBeLessThan(5); // Should be under 5ms per migration
      console.log(`Complex migration: ${avgTime.toFixed(3)}ms per operation`);
    });

    it('should handle batch migration efficiently', () => {
      const legacyConfigs = Array.from({ length: 50 }, (_, i) => ({
        env: i % 2 === 0 ? 'development' : 'production',
        roots: {
          source: `app${i}`,
          target: `build${i}`,
        },
        server: {
          port: 3000 + i,
          localOnly: i % 2 === 0,
        },
        scripts: {
          babel: i % 3 === 0,
          typescript: i % 2 === 0,
        },
      }));

      const startTime = performance.now();
      const results = legacyConfigs.map(config => migrateConfig(config));
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      const avgTime = totalTime / legacyConfigs.length;

      expect(results.every(r => r.success)).toBe(true);
      expect(avgTime).toBeLessThan(3); // Should be under 3ms per migration
      expect(totalTime).toBeLessThan(200); // Total should be under 200ms
      
      console.log(`Batch migration (${legacyConfigs.length} configs): ${avgTime.toFixed(3)}ms per operation, ${totalTime.toFixed(1)}ms total`);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors efficiently', () => {
      const errorHandler = new ErrorHandler({
        logToConsole: false,
        collectErrors: true,
      });

      const errors = Array.from({ length: 100 }, (_, i) => 
        new Error(`Test error ${i}`)
      );

      const startTime = performance.now();
      errors.forEach(error => errorHandler.handleError(error));
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      const avgTime = totalTime / errors.length;

      expect(errorHandler.getErrors()).toHaveLength(100);
      expect(avgTime).toBeLessThan(0.5); // Should be under 0.5ms per error
      expect(totalTime).toBeLessThan(50); // Total should be under 50ms
      
      console.log(`Error handling (${errors.length} errors): ${avgTime.toFixed(3)}ms per operation, ${totalTime.toFixed(1)}ms total`);
    });

    it('should format errors efficiently', () => {
      const errorHandler = new ErrorHandler({
        logToConsole: false,
        collectErrors: true,
      });

      // Generate test errors
      const errors = Array.from({ length: 50 }, (_, i) => 
        new Error(`Test error ${i} with some details`)
      );

      errors.forEach(error => errorHandler.handleError(error));
      const balmErrors = errorHandler.getErrors();

      const startTime = performance.now();
      balmErrors.forEach(error => {
        // Import formatErrorForConsole here to avoid circular dependency issues
        const { formatErrorForConsole } = require('../errors/formatter.js');
        formatErrorForConsole(error, { colors: false });
      });
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      const avgTime = totalTime / balmErrors.length;

      expect(avgTime).toBeLessThan(1); // Should be under 1ms per format
      expect(totalTime).toBeLessThan(100); // Total should be under 100ms
      
      console.log(`Error formatting (${balmErrors.length} errors): ${avgTime.toFixed(3)}ms per operation, ${totalTime.toFixed(1)}ms total`);
    });

    it('should generate suggestions efficiently', async () => {
      const suggestionEngine = new SuggestionEngine();
      
      // Create test errors
      const { createCompilationError } = require('../errors/factory.js');
      const errors = Array.from({ length: 20 }, (_, i) => 
        createCompilationError('COMPILATION-MODULE-001', {
          module: `missing-package-${i}`,
        }, {
          location: { filePath: `/src/file${i}.js` },
        })
      );

      const startTime = performance.now();
      const suggestions = await Promise.all(
        errors.map(error => suggestionEngine.suggest(error))
      );
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      const avgTime = totalTime / errors.length;

      expect(suggestions.every(s => s.suggestions.length > 0)).toBe(true);
      expect(avgTime).toBeLessThan(10); // Should be under 10ms per suggestion
      expect(totalTime).toBeLessThan(500); // Total should be under 500ms
      
      console.log(`Suggestion generation (${errors.length} errors): ${avgTime.toFixed(3)}ms per operation, ${totalTime.toFixed(1)}ms total`);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during repeated operations', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform many operations
      for (let i = 0; i < 1000; i++) {
        const config = {
          mode: 'development',
          bundler: 'webpack',
          paths: { src: `src${i}`, dist: `dist${i}` },
        };
        
        validateConfig(config);
        
        if (i % 100 === 0) {
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }
        }
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseKB = memoryIncrease / 1024;

      // Memory increase should be reasonable (less than 1MB for 1000 operations)
      expect(memoryIncreaseKB).toBeLessThan(1024);
      
      console.log(`Memory increase after 1000 operations: ${memoryIncreaseKB.toFixed(1)}KB`);
    });

    it('should handle large configurations without excessive memory usage', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Create a very large configuration
      const largeConfig: any = {
        mode: 'production',
        bundler: 'webpack',
        paths: {
          src: 'src',
          dist: 'dist',
        },
        devServer: {
          proxy: {},
        },
      };

      // Add many proxy rules
      for (let i = 0; i < 1000; i++) {
        largeConfig.devServer.proxy[`/api${i}`] = `http://localhost:${3000 + i}`;
      }

      // Validate the large configuration multiple times
      for (let i = 0; i < 100; i++) {
        validateConfig(largeConfig);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseKB = memoryIncrease / 1024;

      // Memory increase should be reasonable
      expect(memoryIncreaseKB).toBeLessThan(2048); // Less than 2MB
      
      console.log(`Memory increase for large config operations: ${memoryIncreaseKB.toFixed(1)}KB`);
    });
  });

  describe('Scalability Tests', () => {
    it('should scale linearly with configuration size', () => {
      const sizes = [10, 50, 100, 200];
      const results: Array<{ size: number; time: number }> = [];

      for (const size of sizes) {
        const config: any = {
          mode: 'development',
          bundler: 'webpack',
          devServer: { proxy: {} },
        };

        // Add properties proportional to size
        for (let i = 0; i < size; i++) {
          config.devServer.proxy[`/api${i}`] = `http://localhost:${3000 + i}`;
        }

        const iterations = 100;
        const startTime = performance.now();

        for (let i = 0; i < iterations; i++) {
          validateConfig(config);
        }

        const endTime = performance.now();
        const avgTime = (endTime - startTime) / iterations;
        
        results.push({ size, time: avgTime });
      }

      // Check that performance scales reasonably
      for (let i = 1; i < results.length; i++) {
        const prev = results[i - 1];
        const curr = results[i];
        const sizeRatio = curr.size / prev.size;
        const timeRatio = curr.time / prev.time;

        // Time should not increase more than 2x the size ratio
        expect(timeRatio).toBeLessThan(sizeRatio * 2);
      }

      console.log('Scalability results:', results.map(r => 
        `Size ${r.size}: ${r.time.toFixed(3)}ms`
      ).join(', '));
    });
  });

  describe('Comparison Benchmarks', () => {
    it('should compare validation vs migration performance', () => {
      const modernConfig: ModernBalmConfig = {
        mode: 'production',
        bundler: 'webpack',
        paths: { src: 'src', dist: 'dist' },
        devServer: { port: 3000 },
        compiler: { primary: 'babel' },
      };

      const legacyConfig = {
        production: true,
        roots: { source: 'src', target: 'dist' },
        server: { port: 3000 },
        scripts: { babel: true },
      };

      const iterations = 200;

      // Benchmark validation
      const validationStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        validateConfig(modernConfig);
      }
      const validationEnd = performance.now();
      const validationTime = (validationEnd - validationStart) / iterations;

      // Benchmark migration
      const migrationStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        migrateConfig(legacyConfig);
      }
      const migrationEnd = performance.now();
      const migrationTime = (migrationEnd - migrationStart) / iterations;

      console.log(`Validation: ${validationTime.toFixed(3)}ms, Migration: ${migrationTime.toFixed(3)}ms`);
      console.log(`Migration is ${(migrationTime / validationTime).toFixed(1)}x slower than validation`);

      // Migration should be slower but not excessively so
      expect(migrationTime).toBeGreaterThan(validationTime);
      expect(migrationTime).toBeLessThan(validationTime * 10); // Less than 10x slower
    });
  });
});