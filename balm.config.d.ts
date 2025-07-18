/**
 * TypeScript definitions for BalmJS configuration
 * Provides type safety and IDE support for balm.config.js
 */

import { ModernBalmConfig } from './packages/balm-core/src/config/modern';

declare module 'balm-core' {
  export { ModernBalmConfig };
  export * from './packages/balm-core/src/config/modern';
  export * from './packages/balm-core/src/compiler/base';
  export * from './packages/balm-core/src/bundler/base';
}

/**
 * Configuration function type
 */
export type BalmConfigFunction = () => ModernBalmConfig | Promise<ModernBalmConfig>;

/**
 * Configuration export types
 */
export type BalmConfigExport = 
  | ModernBalmConfig 
  | BalmConfigFunction
  | {
      config: ModernBalmConfig;
      api?: (mix: any) => void;
    };

/**
 * Global configuration augmentation
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      BALM_ENV?: 'development' | 'production';
      BALM_CWD?: string;
    }
  }
}

/**
 * Module declaration for balm.config.js
 */
declare module '*/balm.config.js' {
  const config: BalmConfigExport;
  export = config;
}

declare module '*/balm.config.ts' {
  const config: BalmConfigExport;
  export = config;
}

declare module '*/balm.config.mjs' {
  const config: BalmConfigExport;
  export default config;
}

/**
 * JSDoc type annotations for JavaScript users
 */
export interface JSDocTypes {
  /**
   * @typedef {import('balm-core').ModernBalmConfig} BalmConfig
   */
  BalmConfig: ModernBalmConfig;

  /**
   * @typedef {import('balm-core').CompilerOptions} CompilerOptions
   */
  CompilerOptions: import('./packages/balm-core/src/compiler/base').CompilerOptions;

  /**
   * @typedef {import('balm-core').BundlerOptions} BundlerOptions
   */
  BundlerOptions: import('./packages/balm-core/src/bundler/base').BundlerOptions;
}

/**
 * Configuration examples and templates
 */
export interface ConfigTemplates {
  /**
   * Basic SPA configuration with Vite and SWC
   */
  spa: ModernBalmConfig;

  /**
   * Library configuration with Rollup
   */
  library: ModernBalmConfig;

  /**
   * Legacy configuration with Webpack and Babel
   */
  legacy: ModernBalmConfig;

  /**
   * Full-featured configuration with all options
   */
  full: ModernBalmConfig;
}

/**
 * Configuration presets
 */
export const configPresets: ConfigTemplates;

/**
 * Helper functions for configuration
 */
export interface ConfigHelpers {
  /**
   * Create a configuration for React projects
   */
  react(options?: Partial<ModernBalmConfig>): ModernBalmConfig;

  /**
   * Create a configuration for Vue projects
   */
  vue(options?: Partial<ModernBalmConfig>): ModernBalmConfig;

  /**
   * Create a configuration for library projects
   */
  library(options?: Partial<ModernBalmConfig>): ModernBalmConfig;

  /**
   * Create a configuration for static sites
   */
  static(options?: Partial<ModernBalmConfig>): ModernBalmConfig;

  /**
   * Merge multiple configurations
   */
  merge(...configs: Partial<ModernBalmConfig>[]): ModernBalmConfig;

  /**
   * Validate configuration
   */
  validate(config: Partial<ModernBalmConfig>): import('./packages/balm-core/src/config/modern').ValidationResult;

  /**
   * Migrate old configuration
   */
  migrate(oldConfig: any, fromVersion?: string): {
    config: ModernBalmConfig;
    info: import('./packages/balm-core/src/config/modern').MigrationInfo;
  };
}

export const configHelpers: ConfigHelpers;