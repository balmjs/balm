/**
 * Configuration migration tool
 * Handles automatic migration from old BalmJS configurations to modern format
 */

import fs from 'node:fs';
import path from 'node:path';
import { BalmConfig } from '@balm-core/index';
import { ModernBalmConfig, MigrationInfo, ConfigChange, ConfigDeprecation } from './modern.js';

/**
 * Configuration migrator class
 */
export class ConfigMigrator {
  private migrations = new Map<string, MigrationRule[]>();

  constructor() {
    this.registerMigrations();
  }

  /**
   * Migrate configuration from old version to new version
   */
  migrate(
    oldConfig: any,
    fromVersion: string,
    toVersion: string = '5.0.0'
  ): {
    config: Partial<ModernBalmConfig>;
    info: MigrationInfo;
  } {
    const migrationPath = this.getMigrationPath(fromVersion, toVersion);
    const changes: ConfigChange[] = [];
    const breakingChanges: ConfigChange[] = [];
    const deprecations: ConfigDeprecation[] = [];

    let config = { ...oldConfig };

    // Apply migrations in order
    for (const version of migrationPath) {
      const rules = this.migrations.get(version) || [];
      for (const rule of rules) {
        const result = rule.migrate(config);
        config = result.config;
        changes.push(...result.changes);
        breakingChanges.push(...result.breakingChanges);
        deprecations.push(...result.deprecations);
      }
    }

    return {
      config: this.transformToModernConfig(config),
      info: {
        fromVersion,
        toVersion,
        changes,
        breakingChanges,
        deprecations,
      },
    };
  }

  /**
   * Check if migration is needed
   */
  needsMigration(config: any, currentVersion: string = '5.0.0'): boolean {
    // Check for old configuration patterns
    if (config.scripts && !config.compiler) {
      return true;
    }

    if (config.scripts?.bundler && !config.bundler) {
      return true;
    }

    // Check version in config
    if (config.version && this.isOlderVersion(config.version, currentVersion)) {
      return true;
    }

    return false;
  }

  /**
   * Generate migration report
   */
  generateMigrationReport(info: MigrationInfo): string {
    const lines: string[] = [];
    
    lines.push(`# BalmJS Configuration Migration Report`);
    lines.push(`From version: ${info.fromVersion}`);
    lines.push(`To version: ${info.toVersion}`);
    lines.push('');

    if (info.changes.length > 0) {
      lines.push('## Changes Applied');
      for (const change of info.changes) {
        lines.push(`- ${change.type.toUpperCase()}: ${change.path} - ${change.description}`);
        if (change.migration) {
          lines.push(`  Migration: ${change.migration}`);
        }
      }
      lines.push('');
    }

    if (info.breakingChanges.length > 0) {
      lines.push('## Breaking Changes');
      for (const change of info.breakingChanges) {
        lines.push(`- ${change.path}: ${change.description}`);
        if (change.migration) {
          lines.push(`  Action required: ${change.migration}`);
        }
      }
      lines.push('');
    }

    if (info.deprecations.length > 0) {
      lines.push('## Deprecations');
      for (const deprecation of info.deprecations) {
        lines.push(`- ${deprecation.path}: ${deprecation.message}`);
        if (deprecation.replacement) {
          lines.push(`  Use instead: ${deprecation.replacement}`);
        }
        if (deprecation.removeInVersion) {
          lines.push(`  Will be removed in: ${deprecation.removeInVersion}`);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Backup existing configuration
   */
  async backupConfig(configPath: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${configPath}.backup.${timestamp}`;
    
    await fs.promises.copyFile(configPath, backupPath);
    return backupPath;
  }

  /**
   * Write migrated configuration
   */
  async writeMigratedConfig(
    configPath: string,
    config: Partial<ModernBalmConfig>,
    backup = true
  ): Promise<void> {
    if (backup && fs.existsSync(configPath)) {
      await this.backupConfig(configPath);
    }

    const configContent = this.generateConfigFile(config);
    await fs.promises.writeFile(configPath, configContent, 'utf-8');
  }

  /**
   * Register migration rules
   */
  private registerMigrations(): void {
    // Migration from v4.x to v5.0
    this.migrations.set('5.0.0', [
      {
        migrate: (config: any) => {
          const changes: ConfigChange[] = [];
          const breakingChanges: ConfigChange[] = [];
          const deprecations: ConfigDeprecation[] = [];
          const newConfig = { ...config };

          // Migrate scripts to compiler and bundler
          if (config.scripts) {
            // Extract compiler configuration
            newConfig.compiler = {
              type: 'babel', // Default to babel for backward compatibility
              options: {
                target: config.scripts.target || 'es2020',
                module: config.scripts.module || 'es6',
                jsx: config.scripts.jsx || 'react-jsx',
                sourceMap: config.scripts.sourceMap !== false,
              },
            };

            // Extract bundler configuration
            const bundlerType = config.scripts.bundler || 'webpack';
            newConfig.bundler = {
              type: bundlerType,
              options: {
                mode: config.env?.isProd ? 'production' : 'development',
                entry: config.scripts.entry,
                output: {
                  path: config.dest?.js || 'dist/js',
                  filename: '[name].js',
                },
                sourceMap: config.scripts.sourceMap !== false,
              },
            };

            // Migrate webpack-specific options
            if (bundlerType === 'webpack' && config.scripts.webpackOptions) {
              newConfig.bundler.webpack = config.scripts.webpackOptions;
            }

            changes.push({
              type: 'moved',
              path: 'scripts',
              description: 'Scripts configuration split into compiler and bundler',
              migration: 'Configuration automatically migrated to new structure',
            });

            delete newConfig.scripts;
          }

          // Migrate target configuration
          if (!newConfig.target) {
            newConfig.target = {
              esVersion: 'es2020',
              browsers: config.browserslist || ['defaults'],
            };

            changes.push({
              type: 'added',
              path: 'target',
              description: 'Added explicit target configuration',
            });
          }

          // Add modern features configuration
          if (!newConfig.features) {
            newConfig.features = {
              hmr: true,
              splitting: true,
              treeshaking: true,
              minification: config.env?.isProd || false,
              sourceMap: true,
              cssExtraction: config.env?.isProd || false,
              polyfillInjection: true,
              modernSyntax: true,
            };

            changes.push({
              type: 'added',
              path: 'features',
              description: 'Added feature flags configuration',
            });
          }

          // Add error handling configuration
          if (!newConfig.errorHandling) {
            newConfig.errorHandling = {
              enhanced: true,
              suggestions: true,
              codeFrame: true,
              autoFix: false,
              formatters: {
                terminal: true,
                json: false,
                html: false,
              },
            };

            changes.push({
              type: 'added',
              path: 'errorHandling',
              description: 'Added enhanced error handling configuration',
            });
          }

          // Deprecate old properties
          if (config.useDefaults !== undefined) {
            deprecations.push({
              path: 'useDefaults',
              message: 'useDefaults is deprecated',
              replacement: 'Use specific feature flags in features configuration',
              removeInVersion: '6.0.0',
            });
          }

          return { config: newConfig, changes, breakingChanges, deprecations };
        },
      },
    ]);

    // Add more migration rules for other versions as needed
  }

  /**
   * Transform old config to modern config structure
   */
  private transformToModernConfig(config: any): Partial<ModernBalmConfig> {
    // Ensure all required modern properties exist
    const modernConfig: Partial<ModernBalmConfig> = {
      ...config,
      compiler: config.compiler || {
        type: 'babel',
        options: {
          target: 'es2020',
          module: 'es6',
          sourceMap: true,
        },
      },
      bundler: config.bundler || {
        type: 'webpack',
        options: {
          mode: 'development',
          sourceMap: true,
        },
      },
      target: config.target || {
        esVersion: 'es2020',
        browsers: ['defaults'],
      },
      features: config.features || {
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

    return modernConfig;
  }

  /**
   * Generate configuration file content
   */
  private generateConfigFile(config: Partial<ModernBalmConfig>): string {
    const lines: string[] = [];
    
    lines.push('/**');
    lines.push(' * BalmJS Modern Configuration');
    lines.push(' * Generated by automatic migration tool');
    lines.push(' * @type {import("balm-core").ModernBalmConfig}');
    lines.push(' */');
    lines.push('');
    lines.push('module.exports = {');
    
    // Add configuration sections
    if (config.compiler) {
      lines.push('  // Compiler configuration');
      lines.push(`  compiler: ${JSON.stringify(config.compiler, null, 4).replace(/^/gm, '  ')},`);
      lines.push('');
    }

    if (config.bundler) {
      lines.push('  // Bundler configuration');
      lines.push(`  bundler: ${JSON.stringify(config.bundler, null, 4).replace(/^/gm, '  ')},`);
      lines.push('');
    }

    if (config.target) {
      lines.push('  // Target environment');
      lines.push(`  target: ${JSON.stringify(config.target, null, 4).replace(/^/gm, '  ')},`);
      lines.push('');
    }

    if (config.features) {
      lines.push('  // Feature flags');
      lines.push(`  features: ${JSON.stringify(config.features, null, 4).replace(/^/gm, '  ')},`);
      lines.push('');
    }

    // Add other sections as needed
    const otherKeys = Object.keys(config).filter(key => 
      !['compiler', 'bundler', 'target', 'features'].includes(key)
    );

    for (const key of otherKeys) {
      if (config[key as keyof ModernBalmConfig]) {
        lines.push(`  // ${key} configuration`);
        lines.push(`  ${key}: ${JSON.stringify(config[key as keyof ModernBalmConfig], null, 4).replace(/^/gm, '  ')},`);
        lines.push('');
      }
    }

    lines.push('};');
    
    return lines.join('\n');
  }

  /**
   * Get migration path between versions
   */
  private getMigrationPath(fromVersion: string, toVersion: string): string[] {
    // For now, simple direct migration to target version
    // In the future, this could handle multi-step migrations
    return [toVersion];
  }

  /**
   * Check if version is older
   */
  private isOlderVersion(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part < v2Part) return true;
      if (v1Part > v2Part) return false;
    }

    return false;
  }
}

/**
 * Migration rule interface
 */
interface MigrationRule {
  migrate(config: any): {
    config: any;
    changes: ConfigChange[];
    breakingChanges: ConfigChange[];
    deprecations: ConfigDeprecation[];
  };
}

// Export singleton instance
export const configMigrator = new ConfigMigrator();