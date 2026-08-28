import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    include: ['./test/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/.git/**', '**/test/app/test.ts'],
    fileParallelism: false,
    pool: 'forks',
    forks: {
      singleFork: true
    },
    sequence: {
      concurrent: false
    },
    testTimeout: 15000,
    hookTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['packages/balm-core/src/**/*.ts', 'packages/balm/src/**/*.js']
    }
  },
  resolve: {
    alias: {
      '@balm-core/index.js': path.resolve(
        __dirname,
        'packages/balm-core/index.d.ts'
      ),
      '@balm-core': path.resolve(__dirname, 'packages/balm-core/src')
    }
  }
});
