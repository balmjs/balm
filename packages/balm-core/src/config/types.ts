/**
 * Modern BalmJS Configuration Types
 */

export type BuildMode = 'development' | 'production' | 'test';
export type Bundler = 'webpack' | 'vite' | 'rollup' | 'esbuild';
export type Compiler = 'babel' | 'swc' | 'typescript' | 'esbuild';

export interface PathConfig {
  src: string;
  dist: string;
  public?: string;
  assets?: string;
}

export interface DevServerConfig {
  host?: string;
  port?: number;
  open?: boolean;
  https?: boolean;
  proxy?: Record<string, string>;
}

export interface CompilerConfig {
  primary?: Compiler;
  target?: string;
  jsx?: boolean;
  typescript?: boolean;
}

export interface ModernBalmConfig {
  mode?: BuildMode;
  bundler?: Bundler;
  paths?: Partial<PathConfig>;
  devServer?: Partial<DevServerConfig>;
  compiler?: Partial<CompilerConfig>;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    value?: any;
  }>;
  warnings: Array<{
    path: string;
    message: string;
    value?: any;
  }>;
  config?: ModernBalmConfig;
}