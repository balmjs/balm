/**
 * Unit tests for compiler base classes and interfaces
 */

import { BaseCompiler, CompilerOptions, TransformResult, MinifyResult, CompilerConfig } from '../base.js';
import { DefaultCompilerFactory } from '../factory.js';

// Mock compiler for testing
class MockCompiler extends BaseCompiler {
  async transform(code: string, filename: string): Promise<TransformResult> {
    return {
      code: `// Transformed: ${filename}\n${code}`,
      map: '{"version":3,"sources":[],"mappings":""}',
    };
  }

  async transformFile(filename: string): Promise<TransformResult> {
    return this.transform(`// File content of ${filename}`, filename);
  }

  async minify(code: string, filename?: string): Promise<MinifyResult> {
    return {
      code: code.replace(/\s+/g, ' ').trim(),
      map: undefined,
    };
  }

  getConfig(): CompilerConfig {
    return {
      name: 'mock',
      version: '1.0.0',
      options: this.options,
      extensions: this.getSupportedExtensions(),
    };
  }

  supportsExtension(extension: string): boolean {
    return ['.js', '.ts'].includes(extension.startsWith('.') ? extension : `.${extension}`);
  }

  getSupportedExtensions(): string[] {
    return ['.js', '.ts'];
  }
}

describe('BaseCompiler', () => {
  let compiler: MockCompiler;

  beforeEach(() => {
    compiler = new MockCompiler();
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      const options = compiler.getOptions();
      expect(options.target).toBe('es2020');
      expect(options.module).toBe('es6');
      expect(options.sourceMap).toBe(true);
      expect(options.minify).toBe(false);
    });

    it('should merge custom options with defaults', () => {
      const customCompiler = new MockCompiler({
        target: 'es2022',
        minify: true,
      });
      
      const options = customCompiler.getOptions();
      expect(options.target).toBe('es2022');
      expect(options.minify).toBe(true);
      expect(options.module).toBe('es6'); // default preserved
    });
  });

  describe('updateOptions', () => {
    it('should update options correctly', () => {
      compiler.updateOptions({ target: 'es2022', minify: true });
      
      const options = compiler.getOptions();
      expect(options.target).toBe('es2022');
      expect(options.minify).toBe(true);
    });
  });

  describe('abstract methods', () => {
    it('should implement transform method', async () => {
      const result = await compiler.transform('const x = 1;', 'test.js');
      expect(result.code).toContain('Transformed: test.js');
      expect(result.code).toContain('const x = 1;');
      expect(result.map).toBeDefined();
    });

    it('should implement transformFile method', async () => {
      const result = await compiler.transformFile('test.js');
      expect(result.code).toContain('File content of test.js');
    });

    it('should implement minify method', async () => {
      const result = await compiler.minify('const   x   =   1;');
      expect(result.code).toBe('const x = 1;');
    });

    it('should implement getConfig method', () => {
      const config = compiler.getConfig();
      expect(config.name).toBe('mock');
      expect(config.version).toBe('1.0.0');
      expect(config.extensions).toEqual(['.js', '.ts']);
    });

    it('should implement supportsExtension method', () => {
      expect(compiler.supportsExtension('.js')).toBe(true);
      expect(compiler.supportsExtension('js')).toBe(true);
      expect(compiler.supportsExtension('.ts')).toBe(true);
      expect(compiler.supportsExtension('.jsx')).toBe(false);
    });

    it('should implement getSupportedExtensions method', () => {
      const extensions = compiler.getSupportedExtensions();
      expect(extensions).toEqual(['.js', '.ts']);
    });
  });
});

describe('DefaultCompilerFactory', () => {
  let factory: DefaultCompilerFactory;

  beforeEach(() => {
    factory = new DefaultCompilerFactory();
    // Register mock compiler for testing
    factory.registerCompiler('mock', MockCompiler);
  });

  describe('registerCompiler', () => {
    it('should register a compiler', () => {
      expect(factory.isCompilerAvailable('mock')).toBe(true);
      expect(factory.getSupportedCompilers()).toContain('mock');
    });
  });

  describe('createCompiler', () => {
    it('should create a compiler instance', () => {
      const compiler = factory.createCompiler('mock');
      expect(compiler).toBeInstanceOf(MockCompiler);
    });

    it('should create compiler with options', () => {
      const compiler = factory.createCompiler('mock', { target: 'es2022' });
      expect(compiler.getOptions().target).toBe('es2022');
    });

    it('should cache compiler instances', () => {
      const compiler1 = factory.createCompiler('mock');
      const compiler2 = factory.createCompiler('mock');
      expect(compiler1).toBe(compiler2);
    });

    it('should throw error for unknown compiler type', () => {
      expect(() => {
        factory.createCompiler('unknown');
      }).toThrow("Compiler type 'unknown' is not registered");
    });
  });

  describe('getBestCompilerForFile', () => {
    it('should return appropriate compiler for file extension', () => {
      const jsCompiler = factory.getBestCompilerForFile('test.js');
      expect(jsCompiler).toBe('mock');
    });

    it('should fallback to babel for unknown extensions', () => {
      // This test assumes babel is registered as fallback
      const compiler = factory.getBestCompilerForFile('test.unknown');
      expect(typeof compiler).toBe('string');
    });
  });

  describe('clearCache', () => {
    it('should clear cached instances', () => {
      const compiler1 = factory.createCompiler('mock');
      factory.clearCache();
      const compiler2 = factory.createCompiler('mock');
      expect(compiler1).not.toBe(compiler2);
    });
  });

  describe('getStats', () => {
    it('should return compiler statistics', () => {
      factory.createCompiler('mock');
      factory.createCompiler('mock', { target: 'es2022' });
      
      const stats = factory.getStats();
      expect(stats.mock).toBe(2);
    });
  });
});