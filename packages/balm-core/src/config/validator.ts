/**
 * Configuration validator for BalmJS
 * Provides comprehensive validation for BalmJS configuration
 */

import { ModernBalmConfig, ConfigValidationResult, BuildMode, Bundler, Compiler } from './types.js';

/**
 * Validation error class
 */
class ValidationError {
  constructor(
    public path: string,
    public message: string,
    public value?: any
  ) {}
}

/**
 * Validation warning class
 */
class ValidationWarning {
  constructor(
    public path: string,
    public message: string,
    public value?: any
  ) {}
}

/**
 * Configuration validator class
 */
export class ConfigValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  /**
   * Validate a configuration object
   */
  validate(config: any): ConfigValidationResult {
    this.errors = [];
    this.warnings = [];

    if (!config || typeof config !== 'object') {
      this.addError('', 'Configuration must be an object', config);
      return {
        valid: false,
        errors: this.errors.map(e => ({ path: e.path, message: e.message, value: e.value })),
        warnings: this.warnings.map(w => ({ path: w.path, message: w.message, value: w.value })),
      };
    }

    // Validate each configuration section
    this.validateMode(config.mode);
    this.validateBundler(config.bundler);
    this.validatePaths(config.paths);
    this.validateDevServer(config.devServer);
    this.validateCompiler(config.compiler);

    const isValid = this.errors.length === 0;
    
    return {
      valid: isValid,
      errors: this.errors.map(e => ({ path: e.path, message: e.message, value: e.value })),
      warnings: this.warnings.map(w => ({ path: w.path, message: w.message, value: w.value })),
      config: isValid ? this.normalizeConfig(config) : undefined,
    };
  }

  /**
   * Validate build mode
   */
  private validateMode(mode: any): void {
    if (mode !== undefined) {
      const validModes: BuildMode[] = ['development', 'production', 'test'];
      if (!validModes.includes(mode)) {
        this.addError('mode', `Invalid build mode. Must be one of: ${validModes.join(', ')}`, mode);
      }
    }
  }

  /**
   * Validate bundler configuration
   */
  private validateBundler(bundler: any): void {
    if (bundler !== undefined) {
      const validBundlers: Bundler[] = ['webpack', 'vite', 'rollup', 'esbuild'];
      if (!validBundlers.includes(bundler)) {
        this.addError('bundler', `Invalid bundler. Must be one of: ${validBundlers.join(', ')}`, bundler);
      }
    }
  }

  /**
   * Validate paths configuration
   */
  private validatePaths(paths: any): void {
    if (paths !== undefined) {
      if (typeof paths !== 'object' || paths === null) {
        this.addError('paths', 'Paths configuration must be an object', paths);
        return;
      }

      // Validate src path
      if (paths.src !== undefined) {
        if (typeof paths.src !== 'string') {
          this.addError('paths.src', 'Source path must be a string', paths.src);
        } else if (paths.src.trim() === '') {
          this.addError('paths.src', 'Source path cannot be empty', paths.src);
        }
      }

      // Validate dist path
      if (paths.dist !== undefined) {
        if (typeof paths.dist !== 'string') {
          this.addError('paths.dist', 'Distribution path must be a string', paths.dist);
        } else if (paths.dist.trim() === '') {
          this.addError('paths.dist', 'Distribution path cannot be empty', paths.dist);
        }
      }

      // Validate public path
      if (paths.public !== undefined && typeof paths.public !== 'string') {
        this.addError('paths.public', 'Public path must be a string', paths.public);
      }

      // Validate assets path
      if (paths.assets !== undefined && typeof paths.assets !== 'string') {
        this.addError('paths.assets', 'Assets path must be a string', paths.assets);
      }
    }
  }

  /**
   * Validate dev server configuration
   */
  private validateDevServer(devServer: any): void {
    if (devServer !== undefined) {
      if (typeof devServer !== 'object' || devServer === null) {
        this.addError('devServer', 'Dev server configuration must be an object', devServer);
        return;
      }

      // Validate host
      if (devServer.host !== undefined && typeof devServer.host !== 'string') {
        this.addError('devServer.host', 'Host must be a string', devServer.host);
      }

      // Validate port
      if (devServer.port !== undefined) {
        if (typeof devServer.port !== 'number') {
          this.addError('devServer.port', 'Port must be a number', devServer.port);
        } else if (devServer.port < 1 || devServer.port > 65535) {
          this.addError('devServer.port', 'Port must be between 1 and 65535', devServer.port);
        }
      }

      // Validate open
      if (devServer.open !== undefined && typeof devServer.open !== 'boolean') {
        this.addError('devServer.open', 'Open must be a boolean', devServer.open);
      }

      // Validate https
      if (devServer.https !== undefined && typeof devServer.https !== 'boolean') {
        this.addError('devServer.https', 'HTTPS must be a boolean', devServer.https);
      }

      // Validate proxy
      if (devServer.proxy !== undefined) {
        if (typeof devServer.proxy !== 'object' || devServer.proxy === null) {
          this.addError('devServer.proxy', 'Proxy configuration must be an object', devServer.proxy);
        } else {
          Object.entries(devServer.proxy).forEach(([key, value]) => {
            if (typeof value !== 'string') {
              this.addError(`devServer.proxy.${key}`, 'Proxy target must be a string', value);
            }
          });
        }
      }
    }
  }

  /**
   * Validate compiler configuration
   */
  private validateCompiler(compiler: any): void {
    if (compiler !== undefined) {
      if (typeof compiler !== 'object' || compiler === null) {
        this.addError('compiler', 'Compiler configuration must be an object', compiler);
        return;
      }

      // Validate primary compiler
      if (compiler.primary !== undefined) {
        const validCompilers: Compiler[] = ['babel', 'swc', 'typescript', 'esbuild'];
        if (!validCompilers.includes(compiler.primary)) {
          this.addError('compiler.primary', `Invalid compiler. Must be one of: ${validCompilers.join(', ')}`, compiler.primary);
        }
      }

      // Validate target
      if (compiler.target !== undefined && typeof compiler.target !== 'string') {
        this.addError('compiler.target', 'Compiler target must be a string', compiler.target);
      }

      // Validate JSX
      if (compiler.jsx !== undefined && typeof compiler.jsx !== 'boolean') {
        this.addError('compiler.jsx', 'JSX option must be a boolean', compiler.jsx);
      }

      // Validate TypeScript
      if (compiler.typescript !== undefined && typeof compiler.typescript !== 'boolean') {
        this.addError('compiler.typescript', 'TypeScript option must be a boolean', compiler.typescript);
      }
    }
  }

  /**
   * Add validation error
   */
  private addError(path: string, message: string, value?: any): void {
    this.errors.push(new ValidationError(path, message, value));
  }

  /**
   * Add validation warning
   */
  private addWarning(path: string, message: string, value?: any): void {
    this.warnings.push(new ValidationWarning(path, message, value));
  }

  /**
   * Normalize configuration with defaults
   */
  private normalizeConfig(config: any): ModernBalmConfig {
    const normalized: ModernBalmConfig = {
      mode: config.mode || 'development',
      bundler: config.bundler || 'webpack',
      paths: {
        src: 'src',
        dist: 'dist',
        public: 'public',
        assets: 'assets',
        ...config.paths,
      },
      devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        https: false,
        ...config.devServer,
      },
      compiler: {
        primary: 'babel',
        target: 'es2020',
        jsx: false,
        typescript: false,
        ...config.compiler,
      },
    };

    return normalized;
  }

  /**
   * Validate configuration schema
   */
  static validateSchema(config: any): ConfigValidationResult {
    const validator = new ConfigValidator();
    return validator.validate(config);
  }

  /**
   * Check if configuration is valid
   */
  static isValid(config: any): boolean {
    const result = ConfigValidator.validateSchema(config);
    return result.valid;
  }

  /**
   * Get validation errors for configuration
   */
  static getErrors(config: any): Array<{ path: string; message: string; value?: any }> {
    const result = ConfigValidator.validateSchema(config);
    return result.errors;
  }

  /**
   * Get validation warnings for configuration
   */
  static getWarnings(config: any): Array<{ path: string; message: string; value?: any }> {
    const result = ConfigValidator.validateSchema(config);
    return result.warnings;
  }

  /**
   * Normalize configuration with validation
   */
  static normalize(config: any): ModernBalmConfig | null {
    const result = ConfigValidator.validateSchema(config);
    return result.config || null;
  }
}

/**
 * Validate configuration
 */
export function validateConfig(config: any): ConfigValidationResult {
  return ConfigValidator.validateSchema(config);
}

/**
 * Check if configuration is valid
 */
export function isValidConfig(config: any): boolean {
  return ConfigValidator.isValid(config);
}

/**
 * Normalize configuration
 */
export function normalizeConfig(config: any): ModernBalmConfig | null {
  return ConfigValidator.normalize(config);
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): ModernBalmConfig {
  return {
    mode: 'development',
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
    },
    compiler: {
      primary: 'babel',
      target: 'es2020',
      jsx: false,
      typescript: false,
    },
  };
}