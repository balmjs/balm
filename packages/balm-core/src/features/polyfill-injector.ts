/**
 * Polyfill automatic injection system for BalmJS
 * Automatically injects polyfills based on detected features and target environments
 */

import { ModernFeaturesDetector, DetectionSummary } from './detector.js';
import { TargetConfigResolver, TargetEnvironment } from './target-resolver.js';
import { ModernBalmConfig } from '../config/modern.js';
import fs from 'node:fs';

/**
 * Polyfill configuration
 */
export interface PolyfillConfig {
  enabled?: boolean;
  mode?: 'usage' | 'entry' | 'auto';
  corejs?: string | { version: string; proposals?: boolean };
  targets?: string | string[] | Record<string, string>;
  include?: string[];
  exclude?: string[];
  useBuiltIns?: 'usage' | 'entry' | false;
  debug?: boolean;
  forceAllTransforms?: boolean;
  shippedProposals?: boolean;
  spec?: boolean;
}

/**
 * Polyfill injection result
 */
export interface PolyfillInjectionResult {
  polyfillsAdded: PolyfillEntry[];
  totalSize: number;
  optimizations: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Polyfill entry information
 */
export interface PolyfillEntry {
  name: string;
  version: string;
  size: number;
  features: string[];
  required: boolean;
  source: 'core-js' | 'regenerator-runtime' | 'custom';
  importPath: string;
}

/**
 * Polyfill database entry
 */
export interface PolyfillDatabase {
  [feature: string]: {
    polyfills: string[];
    size: number;
    dependencies?: string[];
    alternatives?: string[];
    description: string;
    since: string;
  };
}

/**
 * Polyfill automatic injector
 */
export class PolyfillInjector {
  private balmConfig: Partial<ModernBalmConfig>;
  private polyfillConfig: PolyfillConfig;
  private detector: ModernFeaturesDetector;
  private targetResolver: TargetConfigResolver;
  private polyfillDatabase: PolyfillDatabase;

  constructor(
    balmConfig: Partial<ModernBalmConfig>,
    polyfillConfig: PolyfillConfig = {}
  ) {
    this.balmConfig = balmConfig;
    this.polyfillConfig = {
      enabled: true,
      mode: 'auto',
      corejs: { version: '3.32', proposals: false },
      useBuiltIns: 'usage',
      debug: false,
      forceAllTransforms: false,
      shippedProposals: false,
      spec: false,
      ...polyfillConfig,
    };
    
    this.detector = new ModernFeaturesDetector();
    this.targetResolver = new TargetConfigResolver(balmConfig);
    this.polyfillDatabase = this.createPolyfillDatabase();
  }

  /**
   * Analyze project and inject required polyfills
   */
  async injectPolyfills(projectPath: string = process.cwd()): Promise<PolyfillInjectionResult> {
    if (!this.polyfillConfig.enabled) {
      return {
        polyfillsAdded: [],
        totalSize: 0,
        optimizations: ['Polyfill injection disabled'],
        warnings: [],
        recommendations: [],
      };
    }

    console.log('🔧 Analyzing polyfill requirements...');

    // Detect modern features used in the project
    const featureDetection = await this.detector.detectFeatures(projectPath);
    
    // Resolve target environment
    const targetEnvironment = this.targetResolver.resolveTargetEnvironment();
    
    // Determine required polyfills
    const requiredPolyfills = this.determineRequiredPolyfills(
      featureDetection,
      targetEnvironment
    );
    
    // Optimize polyfill selection
    const optimizedPolyfills = this.optimizePolyfills(requiredPolyfills);
    
    // Generate injection result
    const result = this.generateInjectionResult(
      optimizedPolyfills,
      featureDetection,
      targetEnvironment
    );

    console.log(`✅ Polyfill analysis complete. ${result.polyfillsAdded.length} polyfills required.`);
    
    return result;
  }

  /**
   * Generate polyfill configuration for bundlers
   */
  generateBundlerConfig(): any {
    const config: any = {};

    // Babel configuration
    config.babel = {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: this.polyfillConfig.targets || this.targetResolver.generateBrowserslistConfig(),
            useBuiltIns: this.polyfillConfig.useBuiltIns,
            corejs: this.polyfillConfig.corejs,
            debug: this.polyfillConfig.debug,
            forceAllTransforms: this.polyfillConfig.forceAllTransforms,
            shippedProposals: this.polyfillConfig.shippedProposals,
            spec: this.polyfillConfig.spec,
            include: this.polyfillConfig.include,
            exclude: this.polyfillConfig.exclude,
          },
        ],
      ],
    };

    // SWC configuration
    config.swc = {
      env: {
        targets: this.polyfillConfig.targets || this.targetResolver.generateBrowserslistConfig(),
        mode: this.polyfillConfig.useBuiltIns,
        coreJs: typeof this.polyfillConfig.corejs === 'string' 
          ? this.polyfillConfig.corejs 
          : this.polyfillConfig.corejs?.version,
        debug: this.polyfillConfig.debug,
        include: this.polyfillConfig.include,
        exclude: this.polyfillConfig.exclude,
      },
    };

    // Vite configuration
    config.vite = {
      legacy: this.balmConfig.features?.polyfillInjection ? {
        targets: this.polyfillConfig.targets || this.targetResolver.generateBrowserslistConfig(),
        additionalLegacyPolyfills: this.getAdditionalPolyfills(),
        polyfills: this.polyfillConfig.useBuiltIns !== false,
        modernPolyfills: true,
      } : undefined,
    };

    return config;
  }

  /**
   * Generate polyfill import statements
   */
  generatePolyfillImports(polyfills: PolyfillEntry[]): string[] {
    const imports: string[] = [];

    for (const polyfill of polyfills) {
      if (polyfill.required) {
        imports.push(`import '${polyfill.importPath}';`);
      }
    }

    return imports;
  }

  /**
   * Create polyfill entry file
   */
  async createPolyfillEntry(
    polyfills: PolyfillEntry[],
    outputPath: string = 'src/polyfills.js'
  ): Promise<void> {
    const imports = this.generatePolyfillImports(polyfills);
    
    const content = [
      '/**',
      ' * Polyfills for modern JavaScript features',
      ' * Auto-generated by BalmJS Polyfill Injector',
      ` * Generated: ${new Date().toISOString()}`,
      ' */',
      '',
      ...imports,
      '',
      '// Feature detection and conditional loading',
      'if (typeof globalThis === "undefined") {',
      '  // Polyfill globalThis for older environments',
      '  (function() {',
      '    if (typeof global !== "undefined") {',
      '      global.globalThis = global;',
      '    } else if (typeof window !== "undefined") {',
      '      window.globalThis = window;',
      '    } else if (typeof self !== "undefined") {',
      '      self.globalThis = self;',
      '    }',
      '  })();',
      '}',
      '',
      '// Export polyfill information for debugging',
      'export const polyfillInfo = {',
      `  polyfills: ${JSON.stringify(polyfills.map(p => ({ name: p.name, version: p.version, features: p.features })), null, 2)},`,
      `  totalSize: ${polyfills.reduce((sum, p) => sum + p.size, 0)},`,
      `  generated: "${new Date().toISOString()}"`,
      '};',
    ].join('\n');

    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`📝 Created polyfill entry file: ${outputPath}`);
  }

  /**
   * Get polyfill recommendations
   */
  getRecommendations(
    featureDetection: DetectionSummary,
    targetEnvironment: TargetEnvironment
  ): string[] {
    const recommendations: string[] = [];

    // Check for unnecessary polyfills
    const unnecessaryPolyfills = this.findUnnecessaryPolyfills(
      featureDetection,
      targetEnvironment
    );
    
    if (unnecessaryPolyfills.length > 0) {
      recommendations.push(
        `Consider removing ${unnecessaryPolyfills.length} unnecessary polyfills to reduce bundle size`
      );
    }

    // Check for missing polyfills
    const missingPolyfills = this.findMissingPolyfills(
      featureDetection,
      targetEnvironment
    );
    
    if (missingPolyfills.length > 0) {
      recommendations.push(
        `Add ${missingPolyfills.length} missing polyfills for better browser compatibility`
      );
    }

    // Check for alternative implementations
    const alternatives = this.findAlternativeImplementations(featureDetection);
    if (alternatives.length > 0) {
      recommendations.push(
        `Consider using native implementations for ${alternatives.length} features in modern browsers`
      );
    }

    // Bundle size recommendations
    const totalPolyfillSize = this.calculateTotalPolyfillSize(featureDetection);
    if (totalPolyfillSize > 50000) { // 50KB threshold
      recommendations.push(
        'Consider using dynamic imports for polyfills to reduce initial bundle size'
      );
    }

    return recommendations;
  }

  // Private methods

  private determineRequiredPolyfills(
    featureDetection: DetectionSummary,
    targetEnvironment: TargetEnvironment
  ): PolyfillEntry[] {
    const polyfills: PolyfillEntry[] = [];
    const processedPolyfills = new Set<string>();

    for (const featureResult of featureDetection.featuresUsed) {
      const feature = featureResult.feature;
      
      // Check if feature needs polyfill for target environment
      if (this.needsPolyfill(feature.name, targetEnvironment)) {
        const polyfillInfo = this.polyfillDatabase[feature.name];
        
        if (polyfillInfo) {
          for (const polyfillName of polyfillInfo.polyfills) {
            if (!processedPolyfills.has(polyfillName)) {
              polyfills.push(this.createPolyfillEntryFromInfo(
                polyfillName,
                polyfillInfo,
                [feature.name]
              ));
              processedPolyfills.add(polyfillName);
            }
          }
        }
      }
    }

    return polyfills;
  }

  private needsPolyfill(featureName: string, targetEnvironment: TargetEnvironment): boolean {
    // Check if feature is supported by all target browsers
    return !targetEnvironment.supportedFeatures.includes(featureName);
  }

  private createPolyfillEntryFromInfo(
    polyfillName: string,
    polyfillInfo: any,
    features: string[]
  ): PolyfillEntry {
    return {
      name: polyfillName,
      version: this.getPolyfillVersion(polyfillName),
      size: polyfillInfo.size,
      features,
      required: true,
      source: this.getPolyfillSource(polyfillName),
      importPath: this.getPolyfillImportPath(polyfillName),
    };
  }

  private getPolyfillVersion(polyfillName: string): string {
    if (polyfillName.startsWith('core-js')) {
      return typeof this.polyfillConfig.corejs === 'string' 
        ? this.polyfillConfig.corejs 
        : this.polyfillConfig.corejs?.version || '3.32';
    }
    
    if (polyfillName.includes('regenerator')) {
      return '0.14.0';
    }
    
    return 'latest';
  }

  private getPolyfillSource(polyfillName: string): 'core-js' | 'regenerator-runtime' | 'custom' {
    if (polyfillName.startsWith('core-js')) return 'core-js';
    if (polyfillName.includes('regenerator')) return 'regenerator-runtime';
    return 'custom';
  }

  private getPolyfillImportPath(polyfillName: string): string {
    // Handle core-js imports
    if (polyfillName.startsWith('core-js/')) {
      return polyfillName;
    }
    
    // Handle regenerator-runtime
    if (polyfillName.includes('regenerator')) {
      return 'regenerator-runtime/runtime';
    }
    
    // Handle custom polyfills
    return polyfillName;
  }

  private optimizePolyfills(polyfills: PolyfillEntry[]): PolyfillEntry[] {
    // Remove duplicates
    const uniquePolyfills = this.removeDuplicatePolyfills(polyfills);
    
    // Resolve dependencies
    const resolvedPolyfills = this.resolvePolyfillDependencies(uniquePolyfills);
    
    // Apply tree-shaking
    const treeShaken = this.applyTreeShaking(resolvedPolyfills);
    
    return treeShaken;
  }

  private removeDuplicatePolyfills(polyfills: PolyfillEntry[]): PolyfillEntry[] {
    const seen = new Set<string>();
    return polyfills.filter(polyfill => {
      if (seen.has(polyfill.importPath)) {
        return false;
      }
      seen.add(polyfill.importPath);
      return true;
    });
  }

  private resolvePolyfillDependencies(polyfills: PolyfillEntry[]): PolyfillEntry[] {
    const resolved: PolyfillEntry[] = [...polyfills];
    const processedDeps = new Set<string>();

    for (const polyfill of polyfills) {
      const polyfillInfo = this.polyfillDatabase[polyfill.features[0]];
      
      if (polyfillInfo?.dependencies) {
        for (const dep of polyfillInfo.dependencies) {
          if (!processedDeps.has(dep)) {
            const depInfo = this.polyfillDatabase[dep];
            if (depInfo) {
              resolved.push(this.createPolyfillEntryFromInfo(
                depInfo.polyfills[0],
                depInfo,
                [dep]
              ));
              processedDeps.add(dep);
            }
          }
        }
      }
    }

    return resolved;
  }

  private applyTreeShaking(polyfills: PolyfillEntry[]): PolyfillEntry[] {
    // For now, return as-is. Tree-shaking would require more sophisticated analysis
    return polyfills;
  }

  private generateInjectionResult(
    polyfills: PolyfillEntry[],
    featureDetection: DetectionSummary,
    targetEnvironment: TargetEnvironment
  ): PolyfillInjectionResult {
    const totalSize = polyfills.reduce((sum, p) => sum + p.size, 0);
    const optimizations = this.generateOptimizations(polyfills);
    const warnings = this.generateWarnings(polyfills, targetEnvironment);
    const recommendations = this.getRecommendations(featureDetection, targetEnvironment);

    return {
      polyfillsAdded: polyfills,
      totalSize,
      optimizations,
      warnings,
      recommendations,
    };
  }

  private generateOptimizations(polyfills: PolyfillEntry[]): string[] {
    const optimizations: string[] = [];

    if (polyfills.length === 0) {
      optimizations.push('No polyfills needed for target environment');
    } else {
      optimizations.push(`Optimized to ${polyfills.length} essential polyfills`);
    }

    const coreJsPolyfills = polyfills.filter(p => p.source === 'core-js');
    if (coreJsPolyfills.length > 0) {
      optimizations.push(`Using core-js v${coreJsPolyfills[0].version} for ${coreJsPolyfills.length} features`);
    }

    return optimizations;
  }

  private generateWarnings(polyfills: PolyfillEntry[], targetEnvironment: TargetEnvironment): string[] {
    const warnings: string[] = [];

    // Check for large polyfills
    const largePolyfills = polyfills.filter(p => p.size > 10000); // 10KB threshold
    if (largePolyfills.length > 0) {
      warnings.push(`${largePolyfills.length} polyfills are larger than 10KB each`);
    }

    // Check for outdated targets
    const hasLegacyTargets = targetEnvironment.browsers.some(browser => 
      browser.includes('ie') || browser.includes('chrome 4') || browser.includes('firefox 3')
    );
    
    if (hasLegacyTargets) {
      warnings.push('Legacy browser targets detected, consider updating browser support policy');
    }

    return warnings;
  }

  private getAdditionalPolyfills(): string[] {
    const additional: string[] = [];

    // Add common polyfills based on configuration
    if (this.balmConfig.features?.polyfillInjection) {
      additional.push('es.promise.finally');
      additional.push('es.array.flat');
      additional.push('es.object.from-entries');
    }

    return additional;
  }

  private findUnnecessaryPolyfills(
    featureDetection: DetectionSummary,
    targetEnvironment: TargetEnvironment
  ): string[] {
    // Find polyfills that are not needed for the target environment
    return targetEnvironment.polyfillsNeeded.filter(polyfill => 
      !featureDetection.featuresUsed.some(feature => 
        this.polyfillDatabase[feature.feature.name]?.polyfills.includes(polyfill)
      )
    );
  }

  private findMissingPolyfills(
    featureDetection: DetectionSummary,
    targetEnvironment: TargetEnvironment
  ): string[] {
    const missing: string[] = [];
    
    for (const feature of featureDetection.featuresUsed) {
      if (!targetEnvironment.supportedFeatures.includes(feature.feature.name)) {
        const polyfillInfo = this.polyfillDatabase[feature.feature.name];
        if (polyfillInfo && !targetEnvironment.polyfillsNeeded.some(p => 
          polyfillInfo.polyfills.includes(p)
        )) {
          missing.push(...polyfillInfo.polyfills);
        }
      }
    }
    
    return [...new Set(missing)];
  }

  private findAlternativeImplementations(featureDetection: DetectionSummary): string[] {
    return featureDetection.featuresUsed
      .filter(feature => this.polyfillDatabase[feature.feature.name]?.alternatives)
      .map(feature => feature.feature.name);
  }

  private calculateTotalPolyfillSize(featureDetection: DetectionSummary): number {
    return featureDetection.featuresUsed.reduce((total, feature) => {
      const polyfillInfo = this.polyfillDatabase[feature.feature.name];
      return total + (polyfillInfo?.size || 0);
    }, 0);
  }

  private createPolyfillDatabase(): PolyfillDatabase {
    return {
      'optional-chaining': {
        polyfills: ['core-js/features/object/optional-chaining'],
        size: 2500,
        description: 'Optional chaining operator (?.)',
        since: 'ES2020',
      },
      'nullish-coalescing': {
        polyfills: ['core-js/features/object/nullish-coalescing'],
        size: 1800,
        description: 'Nullish coalescing operator (??)',
        since: 'ES2020',
      },
      'private-fields': {
        polyfills: ['@babel/plugin-proposal-private-methods'],
        size: 5000,
        description: 'Private class fields (#field)',
        since: 'ES2022',
      },
      'static-blocks': {
        polyfills: ['@babel/plugin-proposal-class-static-block'],
        size: 3000,
        description: 'Static initialization blocks',
        since: 'ES2022',
      },
      'logical-assignment': {
        polyfills: ['@babel/plugin-proposal-logical-assignment-operators'],
        size: 2000,
        description: 'Logical assignment operators (??=, ||=, &&=)',
        since: 'ES2021',
      },
      'array-at': {
        polyfills: ['core-js/features/array/at'],
        size: 1200,
        description: 'Array.prototype.at',
        since: 'ES2022',
      },
      'array-flat': {
        polyfills: ['core-js/features/array/flat', 'core-js/features/array/flat-map'],
        size: 3500,
        description: 'Array.prototype.flat/flatMap',
        since: 'ES2019',
      },
      'object-from-entries': {
        polyfills: ['core-js/features/object/from-entries'],
        size: 1500,
        description: 'Object.fromEntries',
        since: 'ES2019',
      },
      'promise-allsettled': {
        polyfills: ['core-js/features/promise/all-settled'],
        size: 2800,
        description: 'Promise.allSettled',
        since: 'ES2020',
      },
      'promise-any': {
        polyfills: ['core-js/features/promise/any'],
        size: 2500,
        description: 'Promise.any',
        since: 'ES2021',
      },
      'string-replace-all': {
        polyfills: ['core-js/features/string/replace-all'],
        size: 1800,
        description: 'String.prototype.replaceAll',
        since: 'ES2021',
      },
      'bigint': {
        polyfills: ['core-js/features/bigint'],
        size: 8000,
        description: 'BigInt primitive type',
        since: 'ES2020',
        alternatives: ['Use regular numbers for smaller values'],
      },
      'async-iteration': {
        polyfills: ['regenerator-runtime/runtime'],
        size: 12000,
        dependencies: ['symbol-async-iterator'],
        description: 'Async iteration (for-await-of)',
        since: 'ES2018',
      },
      'symbol-async-iterator': {
        polyfills: ['core-js/features/symbol/async-iterator'],
        size: 1000,
        description: 'Symbol.asyncIterator',
        since: 'ES2018',
      },
    };
  }
}

/**
 * Create polyfill injector instance
 */
export function createPolyfillInjector(
  balmConfig: Partial<ModernBalmConfig>,
  polyfillConfig?: PolyfillConfig
): PolyfillInjector {
  return new PolyfillInjector(balmConfig, polyfillConfig);
}

/**
 * Quick polyfill analysis for a project
 */
export async function analyzePolyfillRequirements(
  balmConfig: Partial<ModernBalmConfig>,
  projectPath: string = process.cwd(),
  polyfillConfig?: PolyfillConfig
): Promise<PolyfillInjectionResult> {
  const injector = createPolyfillInjector(balmConfig, polyfillConfig);
  return injector.injectPolyfills(projectPath);
}

/**
 * Generate polyfill configuration for bundlers
 */
export function generatePolyfillBundlerConfig(
  balmConfig: Partial<ModernBalmConfig>,
  polyfillConfig?: PolyfillConfig
): any {
  const injector = createPolyfillInjector(balmConfig, polyfillConfig);
  return injector.generateBundlerConfig();
}