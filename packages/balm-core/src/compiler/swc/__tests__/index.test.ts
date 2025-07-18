/**
 * Unit tests for SWC compiler
 */

import { SWCCompiler } from '../index.js';

// Mock @swc/core
const mockSWC = {
  transform: jest.fn(),
  minify: jest.fn(),
  version: '1.3.0',
};

jest.mock('@swc/core', () => mockSWC);

describe('SWCCompiler', () => {
  let compiler: SWCCompiler;

  beforeEach(() => {
    jest.clearAllMocks();
    compiler = new SWCCompiler();
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      const options = compiler.getOptions();
      expect(options.target).toBe('es2020');
      expect(options.module).toBe('es6');
      expect(options.sourceMap).toBe(true);
    });

    it('should merge custom options', () => {
      const customCompiler = new SWCCompiler({
        target: 'es2022',
        minify: true,
        jsx: 'react-jsx',
      });
      
      const options = customCompiler.getOptions();
      expect(options.target).toBe('es2022');
      expect(options.minify).toBe(true);
      expect(options.jsx).toBe('react-jsx');
    });

    it('should throw error if SWC is not installed', () => {
      jest.doMock('@swc/core', () => {
        throw new Error('Module not found');
      });

      expect(() => {
        new SWCCompiler();
      }).toThrow('SWC is not installed');
    });
  });

  describe('transform', () => {
    it('should transform JavaScript code', async () => {
      const mockResult = {
        code: 'var x = 1;',
        map: { version: 3, sources: [], mappings: '' },
      };
      mockSWC.transform.mockResolvedValue(mockResult);

      const result = await compiler.transform('const x = 1;', 'test.js');

      expect(result.code).toBe('var x = 1;');
      expect(result.map).toBe(JSON.stringify(mockResult.map));
      expect(mockSWC.transform).toHaveBeenCalledWith(
        'const x = 1;',
        expect.objectContaining({
          filename: 'test.js',
          sourceMaps: true,
        })
      );
    });

    it('should transform TypeScript code', async () => {
      const tsCompiler = new SWCCompiler({
        jsx: 'react-jsx',
      });

      const mockResult = {
        code: 'var x = 1;',
        map: null,
      };
      mockSWC.transform.mockResolvedValue(mockResult);

      const result = await tsCompiler.transform('const x: number = 1;', 'test.ts');

      expect(result.code).toBe('var x = 1;');
      expect(result.map).toBeUndefined();
      expect(mockSWC.transform).toHaveBeenCalledWith(
        'const x: number = 1;',
        expect.objectContaining({
          filename: 'test.ts',
          jsc: expect.objectContaining({
            parser: expect.objectContaining({
              syntax: 'ecmascript', // Should detect based on jsx option
            }),
          }),
        })
      );
    });

    it('should handle JSX/TSX code', async () => {
      const jsxCompiler = new SWCCompiler({
        jsx: 'react-jsx',
      });

      const mockResult = {
        code: 'React.createElement("div", null, "Hello");',
        map: null,
      };
      mockSWC.transform.mockResolvedValue(mockResult);

      const result = await jsxCompiler.transform('<div>Hello</div>', 'test.jsx');

      expect(result.code).toBe('React.createElement("div", null, "Hello");');
      expect(mockSWC.transform).toHaveBeenCalledWith(
        '<div>Hello</div>',
        expect.objectContaining({
          jsc: expect.objectContaining({
            transform: expect.objectContaining({
              react: expect.objectContaining({
                runtime: 'automatic',
              }),
            }),
          }),
        })
      );
    });

    it('should handle transform errors', async () => {
      mockSWC.transform.mockRejectedValue(new Error('Syntax error'));

      await expect(
        compiler.transform('invalid syntax', 'test.js')
      ).rejects.toThrow('SWC transform failed for test.js: Syntax error');
    });
  });

  describe('minify', () => {
    it('should minify code when minify option is enabled', async () => {
      const minifyCompiler = new SWCCompiler({ minify: true });
      
      const mockResult = {
        code: 'var x=1;',
        map: null,
      };
      mockSWC.minify.mockResolvedValue(mockResult);

      const result = await minifyCompiler.minify('var x = 1;', 'test.js');

      expect(result.code).toBe('var x=1;');
      expect(mockSWC.minify).toHaveBeenCalledWith(
        'var x = 1;',
        expect.objectContaining({
          filename: 'test.js',
          minify: true,
        })
      );
    });

    it('should return original code when minify is disabled', async () => {
      const result = await compiler.minify('var x = 1;');
      
      expect(result.code).toBe('var x = 1;');
      expect(mockSWC.minify).not.toHaveBeenCalled();
    });

    it('should handle minify errors', async () => {
      const minifyCompiler = new SWCCompiler({ minify: true });
      mockSWC.minify.mockRejectedValue(new Error('Minify error'));

      await expect(
        minifyCompiler.minify('var x = 1;')
      ).rejects.toThrow('SWC minify failed: Minify error');
    });
  });

  describe('getConfig', () => {
    it('should return compiler configuration', () => {
      const config = compiler.getConfig();
      
      expect(config.name).toBe('swc');
      expect(config.version).toBe('1.3.0');
      expect(config.extensions).toEqual(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
    });
  });

  describe('supportsExtension', () => {
    it('should support JavaScript and TypeScript extensions', () => {
      expect(compiler.supportsExtension('.js')).toBe(true);
      expect(compiler.supportsExtension('js')).toBe(true);
      expect(compiler.supportsExtension('.jsx')).toBe(true);
      expect(compiler.supportsExtension('.ts')).toBe(true);
      expect(compiler.supportsExtension('.tsx')).toBe(true);
      expect(compiler.supportsExtension('.mjs')).toBe(true);
      expect(compiler.supportsExtension('.cjs')).toBe(true);
    });

    it('should not support unsupported extensions', () => {
      expect(compiler.supportsExtension('.css')).toBe(false);
      expect(compiler.supportsExtension('.html')).toBe(false);
      expect(compiler.supportsExtension('.json')).toBe(false);
    });
  });

  describe('SWC options mapping', () => {
    it('should map ES targets correctly', () => {
      const es5Compiler = new SWCCompiler({ target: 'es5' });
      const es2022Compiler = new SWCCompiler({ target: 'es2022' });
      
      const es5Options = es5Compiler.getSWCOptions();
      const es2022Options = es2022Compiler.getSWCOptions();
      
      expect(es5Options.jsc?.target).toBe('es5');
      expect(es2022Options.jsc?.target).toBe('es2022');
    });

    it('should map module types correctly', () => {
      const cjsCompiler = new SWCCompiler({ module: 'commonjs' });
      const esmCompiler = new SWCCompiler({ module: 'es6' });
      
      const cjsOptions = cjsCompiler.getSWCOptions();
      const esmOptions = esmCompiler.getSWCOptions();
      
      expect(cjsOptions.module?.type).toBe('commonjs');
      expect(esmOptions.module?.type).toBe('es6');
    });

    it('should configure React transform correctly', () => {
      const reactCompiler = new SWCCompiler({ jsx: 'react-jsx' });
      const options = reactCompiler.getSWCOptions();
      
      expect(options.jsc?.transform?.react?.runtime).toBe('automatic');
      expect(options.jsc?.parser?.jsx).toBe(true);
    });

    it('should configure decorators correctly', () => {
      const decoratorCompiler = new SWCCompiler({ 
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      });
      const options = decoratorCompiler.getSWCOptions();
      
      expect(options.jsc?.parser?.decorators).toBe(true);
      expect(options.jsc?.transform?.decoratorMetadata).toBe(true);
      expect(options.jsc?.transform?.legacyDecorator).toBe(true);
    });
  });

  describe('presets', () => {
    it('should create React preset', () => {
      const preset = SWCCompiler.createPreset('react');
      
      expect(preset.jsc?.parser?.syntax).toBe('typescript');
      expect(preset.jsc?.parser?.tsx).toBe(true);
      expect(preset.jsc?.transform?.react?.runtime).toBe('automatic');
    });

    it('should create library preset', () => {
      const preset = SWCCompiler.createPreset('library');
      
      expect(preset.jsc?.target).toBe('es2018');
      expect(preset.module?.type).toBe('es6');
      expect(preset.minify).toBe(false);
    });

    it('should create Node.js preset', () => {
      const preset = SWCCompiler.createPreset('node');
      
      expect(preset.jsc?.target).toBe('es2020');
      expect(preset.module?.type).toBe('commonjs');
    });
  });

  describe('updateSWCOptions', () => {
    it('should update SWC-specific options', () => {
      const originalOptions = compiler.getSWCOptions();
      
      compiler.updateSWCOptions({
        jsc: {
          target: 'es2022',
          loose: true,
        },
      });
      
      const updatedOptions = compiler.getSWCOptions();
      expect(updatedOptions.jsc?.target).toBe('es2022');
      expect(updatedOptions.jsc?.loose).toBe(true);
      // Other options should be preserved
      expect(updatedOptions.module).toEqual(originalOptions.module);
    });
  });
});