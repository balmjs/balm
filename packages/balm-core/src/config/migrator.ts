/**
 * Configuration migrator for BalmJS
 * Handles migration from legacy configuration formats to modern format
 */

import { ModernBalmConfig } from './types.js';

/**
 * Migration change types
 */
export type ChangeType = 'added' | 'removed' | 'modified' | 'renamed' | 'deprecated';

/**
 * Migration change record
 */
export interface MigrationChange {
  type: ChangeType;
  path: string;
  oldValue?: any;
  newValue?: any;
  reason: string;
}

/**
 * Migration result
 */
export interface MigrationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  changes: MigrationChange[];
  config: ModernBalmConfig;
  backup?: any;
}

/**
 * Migration rule interface
 */
interface MigrationRule {
  name: string;
  description: string;
  version: string;
  apply: (config: any) => MigrationChange[];
}

/**
 * Configuration migrator class
 */
export class ConfigMigrator {
  private rules: MigrationRule[] = [];

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Migrate configuration to modern format
   */
  migrate(legacyConfig: any): MigrationResult {
    const backup = JSON.parse(JSON.stringify(legacyConfig));
    const errors: string[] = [];
    const warnings: string[] = [];
    const changes: MigrationChange[] = [];
    
    let config = { ...legacyConfig };

    try {
      // Apply migration rules in order
      for (const rule of this.rules) {
        try {
          const ruleChanges = rule.apply(config);
          changes.push(...ruleChanges);
          
          // Apply changes to config
          for (const change of ruleChanges) {
            this.applyChange(config, change);
          }
        } catch (error) {
          errors.push(`Error applying migration rule '${rule.name}': ${error}`);
        }
      }

      // Ensure config has required structure
      config = this.ensureModernStructure(config);

      return {
        success: errors.length === 0,
        errors,
        warnings,
        changes,
        config: config as ModernBalmConfig,
        backup,
      };
    } catch (error) {
      errors.push(`Migration failed: ${error}`);
      return {
        success: false,
        errors,
        warnings,
        changes,
        config: this.getDefaultConfig(),
        backup,
      };
    }
  }

  /**
   * Add custom migration rule
   */
  addRule(rule: MigrationRule): void {
    this.rules.push(rule);
  }

  /**
   * Setup default migration rules
   */
  private setupDefaultRules(): void {
    // Legacy root properties migration
    this.addRule({
      name: 'legacy-root-properties',
      description: 'Migrate legacy root-level properties',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        // Migrate legacy 'env' to 'mode'
        if (config.env && !config.mode) {
          changes.push({
            type: 'renamed',
            path: 'env',
            oldValue: config.env,
            newValue: config.env,
            reason: 'Property "env" renamed to "mode"',
          });
          config.mode = config.env;
          delete config.env;
        }

        // Migrate legacy 'production' boolean to mode
        if (typeof config.production === 'boolean') {
          const mode = config.production ? 'production' : 'development';
          changes.push({
            type: 'modified',
            path: 'production',
            oldValue: config.production,
            newValue: mode,
            reason: 'Boolean "production" converted to mode string',
          });
          config.mode = mode;
          delete config.production;
        }

        return changes;
      },
    });

    // Legacy paths migration
    this.addRule({
      name: 'legacy-paths',
      description: 'Migrate legacy path configurations',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        // Migrate legacy 'roots' to 'paths'
        if (config.roots && !config.paths) {
          changes.push({
            type: 'renamed',
            path: 'roots',
            oldValue: config.roots,
            newValue: config.roots,
            reason: 'Property "roots" renamed to "paths"',
          });
          config.paths = config.roots;
          delete config.roots;
        }

        // Migrate legacy path properties
        if (config.paths) {
          const pathMappings = {
            source: 'src',
            target: 'dist',
            assets: 'assets',
          };

          for (const [oldKey, newKey] of Object.entries(pathMappings)) {
            if (config.paths[oldKey] && !config.paths[newKey]) {
              changes.push({
                type: 'renamed',
                path: `paths.${oldKey}`,
                oldValue: config.paths[oldKey],
                newValue: config.paths[oldKey],
                reason: `Path property "${oldKey}" renamed to "${newKey}"`,
              });
              config.paths[newKey] = config.paths[oldKey];
              delete config.paths[oldKey];
            }
          }
        }

        return changes;
      },
    });

    // Legacy server configuration migration
    this.addRule({
      name: 'legacy-server',
      description: 'Migrate legacy server configurations',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        // Migrate legacy 'server' to 'devServer'
        if (config.server && !config.devServer) {
          changes.push({
            type: 'renamed',
            path: 'server',
            oldValue: config.server,
            newValue: config.server,
            reason: 'Property "server" renamed to "devServer"',
          });
          config.devServer = config.server;
          delete config.server;
        }

        // Migrate legacy server properties
        if (config.devServer) {
          const serverMappings = {
            localOnly: 'host',
            port: 'port',
            open: 'open',
            https: 'https',
            proxyTable: 'proxy',
          };

          for (const [oldKey, newKey] of Object.entries(serverMappings)) {
            if (config.devServer[oldKey] !== undefined && config.devServer[newKey] === undefined) {
              let newValue = config.devServer[oldKey];
              
              // Special handling for localOnly
              if (oldKey === 'localOnly') {
                newValue = config.devServer[oldKey] ? 'localhost' : '0.0.0.0';
              }

              changes.push({
                type: 'renamed',
                path: `devServer.${oldKey}`,
                oldValue: config.devServer[oldKey],
                newValue,
                reason: `Server property "${oldKey}" renamed to "${newKey}"`,
              });
              
              config.devServer[newKey] = newValue;
              delete config.devServer[oldKey];
            }
          }
        }

        return changes;
      },
    });

    // Legacy scripts configuration migration
    this.addRule({
      name: 'legacy-scripts',
      description: 'Migrate legacy scripts configurations',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        // Migrate legacy 'scripts' to 'compiler'
        if (config.scripts && !config.compiler) {
          const compiler: any = {};

          // Map legacy script options to compiler options
          if (config.scripts.babel !== undefined) {
            compiler.primary = config.scripts.babel ? 'babel' : 'swc';
            changes.push({
              type: 'modified',
              path: 'scripts.babel',
              oldValue: config.scripts.babel,
              newValue: compiler.primary,
              reason: 'Legacy babel option converted to compiler.primary',
            });
          }

          if (config.scripts.typescript !== undefined) {
            compiler.typescript = config.scripts.typescript;
            changes.push({
              type: 'renamed',
              path: 'scripts.typescript',
              oldValue: config.scripts.typescript,
              newValue: config.scripts.typescript,
              reason: 'Moved typescript option to compiler.typescript',
            });
          }

          if (config.scripts.target) {
            compiler.target = config.scripts.target;
            changes.push({
              type: 'renamed',
              path: 'scripts.target',
              oldValue: config.scripts.target,
              newValue: config.scripts.target,
              reason: 'Moved target option to compiler.target',
            });
          }

          config.compiler = compiler;
          delete config.scripts;

          changes.push({
            type: 'renamed',
            path: 'scripts',
            oldValue: config.scripts,
            newValue: compiler,
            reason: 'Property "scripts" restructured as "compiler"',
          });
        }

        return changes;
      },
    });

    // Legacy styles configuration migration
    this.addRule({
      name: 'legacy-styles',
      description: 'Migrate legacy styles configurations',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        // Migrate legacy 'styles' to 'css'
        if (config.styles && !config.css) {
          changes.push({
            type: 'renamed',
            path: 'styles',
            oldValue: config.styles,
            newValue: config.styles,
            reason: 'Property "styles" renamed to "css"',
          });
          config.css = config.styles;
          delete config.styles;
        }

        return changes;
      },
    });

    // Deprecated options removal
    this.addRule({
      name: 'remove-deprecated',
      description: 'Remove deprecated configuration options',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        const deprecatedOptions = [
          'useDefault',
          'legacy',
          'modernizr',
          'sprites',
          'zip',
          'ftp',
          'pwa.workboxSW',
        ];

        for (const option of deprecatedOptions) {
          if (this.hasProperty(config, option)) {
            const value = this.getProperty(config, option);
            changes.push({
              type: 'removed',
              path: option,
              oldValue: value,
              reason: `Deprecated option "${option}" removed`,
            });
            this.deleteProperty(config, option);
          }
        }

        return changes;
      },
    });

    // Add default values for new options
    this.addRule({
      name: 'add-defaults',
      description: 'Add default values for new configuration options',
      version: '4.0.0',
      apply: (config: any) => {
        const changes: MigrationChange[] = [];

        // Add default bundler if not specified
        if (!config.bundler) {
          config.bundler = 'webpack';
          changes.push({
            type: 'added',
            path: 'bundler',
            newValue: 'webpack',
            reason: 'Added default bundler configuration',
          });
        }

        return changes;
      },
    });
  }

  /**
   * Apply a migration change to the configuration
   */
  private applyChange(config: any, change: MigrationChange): void {
    switch (change.type) {
      case 'added':
        this.setProperty(config, change.path, change.newValue);
        break;
      case 'removed':
        this.deleteProperty(config, change.path);
        break;
      case 'modified':
      case 'renamed':
        if (change.newValue !== undefined) {
          this.setProperty(config, change.path, change.newValue);
        }
        break;
    }
  }

  /**
   * Ensure configuration has modern structure
   */
  private ensureModernStructure(config: any): ModernBalmConfig {
    const modern: ModernBalmConfig = {
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

    return modern;
  }

  /**
   * Get default modern configuration
   */
  private getDefaultConfig(): ModernBalmConfig {
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

  /**
   * Check if object has property by path
   */
  private hasProperty(obj: any, path: string): boolean {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return false;
      }
      current = current[key];
    }
    
    return true;
  }

  /**
   * Get property value by path
   */
  private getProperty(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }
    
    return current;
  }

  /**
   * Set property value by path
   */
  private setProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
  }

  /**
   * Delete property by path
   */
  private deleteProperty(obj: any, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current)) {
        return;
      }
      current = current[key];
    }
    
    delete current[lastKey];
  }
}

/**
 * Default migrator instance
 */
export const defaultMigrator = new ConfigMigrator();

/**
 * Migrate configuration using default migrator
 */
export function migrateConfig(legacyConfig: any): MigrationResult {
  return defaultMigrator.migrate(legacyConfig);
}

/**
 * Check if configuration needs migration
 */
export function needsMigration(config: any): boolean {
  // Check for legacy properties that indicate old format
  const legacyProperties = [
    'env',
    'production',
    'roots',
    'server',
    'scripts',
    'styles',
    'useDefault',
    'legacy',
  ];

  return legacyProperties.some(prop => prop in config);
}

/**
 * Get migration preview without applying changes
 */
export function previewMigration(legacyConfig: any): MigrationChange[] {
  const migrator = new ConfigMigrator();
  const result = migrator.migrate(legacyConfig);
  return result.changes;
}