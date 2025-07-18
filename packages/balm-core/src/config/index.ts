/**
 * BalmJS Configuration System
 * 
 * This module provides a modern configuration system for BalmJS with:
 * - Type-safe configuration definitions
 * - Comprehensive validation
 * - Automatic migration from legacy formats
 * - Default value handling
 * - Environment-specific overrides
 */

// Export types
export * from './types.js';

// Export validator
export * from './validator.js';

// Export migrator
export * from './migrator.js';

// Re-export commonly used functions for convenience
export {
  ConfigValidator,
  validateConfig,
  isValidConfig,
  normalizeConfig,
  getDefaultConfig,
} from './validator.js';

export {
  ConfigMigrator,
  migrateConfig,
  needsMigration,
  previewMigration,
  defaultMigrator,
} from './migrator.js';

// Export commonly used types for convenience
export type {
  ModernBalmConfig,
  ConfigValidationResult,
  BuildMode,
  Bundler,
  Compiler,
  PathConfig,
  DevServerConfig,
  CompilerConfig,
} from './types.js';

export type {
  MigrationResult,
  MigrationChange,
  ChangeType,
} from './migrator.js';