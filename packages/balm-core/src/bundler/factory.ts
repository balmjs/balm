/**
 * Bundler factory implementation
 * Manages creation and registration of different bundlers
 */

import { BaseBundler, BundlerOptions, BundlerFactory } from './base.js';

export type BundlerType = 'webpack' | 'vite' | 'rollup' | 'esbuild';

interface BundlerConstructor {
  new (options?: BundlerOptions): BaseBundler;
}

/**
 * Factory class for creating bundler instances
 */
export class DefaultBundlerFactory implements BundlerFactory {
  private bundlers = new Map<string, BundlerConstructor>();
  private instances = new Map<string, BaseBundler>();

  constructor() {
    this.registerDefaultBundlers();
  }

  /**
   * Register default bundlers
   */
  private registerDefaultBundlers(): void {
    // Webpack bundler - existing implementation
    try {
      const { WebpackBundler } = require('./webpack/bundler.js');
      this.registerBundler('webpack', WebpackBundler);
    } catch (error) {
      BalmJS.logger?.debug?.('bundler-factory', 'Webpack bundler not available');
    }

    // Vite bundler - new implementation
    try {
      const { ViteBundler } = require('./vite/index.js');
      this.registerBundler('vite', ViteBundler);
    } catch (error) {
      BalmJS.logger?.debug?.('bundler-factory', 'Vite bundler not available');
    }

    // Rollup bundler - existing implementation
    try {
      const { RollupBundler } = require('./rollup/bundler.js');
      this.registerBundler('rollup', RollupBundler);
    } catch (error) {
      BalmJS.logger?.debug?.('bundler-factory', 'Rollup bundler not available');
    }

    // ESBuild bundler - existing implementation
    try {
      const { ESBuildBundler } = require('./esbuild/bundler.js');
      this.registerBundler('esbuild', ESBuildBundler);
    } catch (error) {
      BalmJS.logger?.debug?.('bundler-factory', 'ESBuild bundler not available');
    }
  }

  /**
   * Register a bundler
   */
  registerBundler(type: string, BundlerClass: BundlerConstructor): void {
    this.bundlers.set(type, BundlerClass);
  }

  /**
   * Create a bundler instance
   */
  createBundler(type: string, options?: BundlerOptions): BaseBundler {
    const cacheKey = `${type}-${JSON.stringify(options || {})}`;
    
    // Return cached instance if available
    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey)!;
    }

    const BundlerClass = this.bundlers.get(type);
    if (!BundlerClass) {
      throw new Error(`Bundler type '${type}' is not registered`);
    }

    try {
      const bundler = new BundlerClass(options);
      this.instances.set(cacheKey, bundler);
      return bundler;
    } catch (error) {
      throw new Error(`Failed to create bundler '${type}': ${(error as Error).message}`);
    }
  }

  /**
   * Get supported bundler types
   */
  getSupportedBundlers(): string[] {
    return Array.from(this.bundlers.keys());
  }

  /**
   * Check if a bundler is available
   */
  isBundlerAvailable(type: string): boolean {
    return this.bundlers.has(type);
  }

  /**
   * Get the best bundler for a project
   */
  getBestBundlerForProject(projectPath: string): string {
    // Check for existing configuration files
    const fs = require('fs');
    const path = require('path');

    // Prefer Vite for modern projects
    if (this.isBundlerAvailable('vite')) {
      const viteConfigExists = [
        'vite.config.js',
        'vite.config.ts',
        'vite.config.mjs',
      ].some(file => fs.existsSync(path.join(projectPath, file)));

      if (viteConfigExists) {
        return 'vite';
      }
    }

    // Check for Webpack config
    if (this.isBundlerAvailable('webpack')) {
      const webpackConfigExists = [
        'webpack.config.js',
        'webpack.config.ts',
      ].some(file => fs.existsSync(path.join(projectPath, file)));

      if (webpackConfigExists) {
        return 'webpack';
      }
    }

    // Check for Rollup config
    if (this.isBundlerAvailable('rollup')) {
      const rollupConfigExists = [
        'rollup.config.js',
        'rollup.config.ts',
      ].some(file => fs.existsSync(path.join(projectPath, file)));

      if (rollupConfigExists) {
        return 'rollup';
      }
    }

    // Default preference: Vite > Webpack > ESBuild > Rollup
    const preferenceOrder = ['vite', 'webpack', 'esbuild', 'rollup'];
    for (const bundler of preferenceOrder) {
      if (this.isBundlerAvailable(bundler)) {
        return bundler;
      }
    }

    throw new Error('No bundlers available');
  }

  /**
   * Get bundler recommendations based on project type
   */
  getRecommendations(projectType: 'spa' | 'library' | 'ssr' | 'static'): string[] {
    const recommendations: { [key: string]: string[] } = {
      spa: ['vite', 'webpack'],
      library: ['rollup', 'esbuild'],
      ssr: ['webpack', 'vite'],
      static: ['vite', 'esbuild'],
    };

    return recommendations[projectType] || ['vite', 'webpack'];
  }

  /**
   * Clear cached instances
   */
  clearCache(): void {
    this.instances.clear();
  }

  /**
   * Get bundler statistics
   */
  getStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    for (const type of this.getSupportedBundlers()) {
      stats[type] = Array.from(this.instances.keys())
        .filter(key => key.startsWith(type))
        .length;
    }
    return stats;
  }

  /**
   * Get bundler performance metrics
   */
  async getPerformanceMetrics(bundlerType: string, testProject: string): Promise<{
    buildTime: number;
    bundleSize: number;
    startupTime: number;
  }> {
    const bundler = this.createBundler(bundlerType);
    
    // Measure build time
    const buildStart = Date.now();
    const result = await bundler.build();
    const buildTime = Date.now() - buildStart;

    // Measure startup time for dev server
    const startupStart = Date.now();
    const devServer = await bundler.serve();
    const startupTime = Date.now() - startupStart;
    await devServer.stop();

    return {
      buildTime,
      bundleSize: result.stats.bundleSize,
      startupTime,
    };
  }
}

// Export singleton instance
export const bundlerFactory = new DefaultBundlerFactory();