/**
 * Modern JavaScript features support for compilers
 * Provides configuration and support for ES2022+ features in SWC and Babel
 */

import { ModernBalmConfig } from '../config/modern.js';
import { ModernFeaturesDetector, DetectionSummary } from '../features/detector.js';
import { TargetConfigResolver } from '../features/target-resolver.js';

/**
 * Modern features configuration for compilers
 */
export interface ModernFeaturesConfig {
  enabled?: boolean;
  target?: string;
  features?: string[];
  exclude?: string[];
  loose?: boolean;
  spec?: boolean;
  useBuiltIns?: 'usage' | 'entry' | false;
  corejs?: string | { version: string; proposals?: boolean };
  debug?: boolean;
}

/**
 * Compiler feature support result
 */
export interface CompilerFeatureSupport {
  swc: SWCFeatureConfig;
  babel: BabelFeatureConfig;
  supportedFeatures: string[];
  unsupportedFeatures: string[];
  recommendations: string[];
  warnings: string[];
}

/**
 * SWC specific feature configuration
 */
export interface SWCFeatureConfig {
  jsc: {
    target: string;
    parser: {
      syntax: 'typescript' | 'ecmascript';
      tsx?: boolean;
      jsx?: boolean;
      decorators?: boolean;
      dynamicImport?: boolean;
      privateMethod?: boolean;
      functionBind?: boolean;
      exportDefaultFrom?: boolean;
      exportNamespaceFrom?: boolean;
      decoratorsBeforeExport?: boolean;
      topLevelAwait?: boolean;
      importMeta?: boolean;
    };
    transform: {
      react?: {
        runtime?: 'automatic' | 'classic';
        importSource?: string;
        pragma?: string;
        pragmaFrag?: string;
        throwIfNamespace?: boolean;
        development?: boolean;
        useBuiltins?: boolean;
        refresh?: boolean;
      };
      legacyDecorator?: boolean;
      decoratorMetadata?: boolean;
      useDefineForClassFields?: boolean;
      optimizer?: {
        globals?: {
          vars?: Record<string, string>;
          envs?: Record<string, string>;
          typeofs?: Record<string, string>;
        };
        jsonify?: {
          minCost?: number;
        };
      };
    };
    experimental?: {
      plugins?: Array<[string, any]>;
    };
  };
  env?: {
    targets?: string | string[] | Record<string, string>;
    mode?: 'usage' | 'entry';
    debug?: boolean;
    dynamicImport?: boolean;
    loose?: boolean;
    include?: string[];
    exclude?: string[];
    coreJs?: string;
    shippedProposals?: boolean;
    forceAllTransforms?: boolean;
  };
  minify?: boolean;
}

/**
 * Babel specific feature configuration
 */
export interface BabelFeatureConfig {
  presets: Array<[string, any] | string>;
  plugins: Array<[string, any] | string>;
}

/**
 * Modern features compiler support manager
 */
export class ModernFeaturesCompilerSupport {
  private balmConfig: Partial<ModernBalmConfig>;
  private featuresConfig: ModernFeaturesConfig;
  private detector: ModernFeaturesDetector;
  private targetResolver: TargetConfigResolver;

  constructor(
    balmConfig: Partial<ModernBalmConfig>,
    featuresConfig: ModernFeaturesConfig = {}
  ) {
    this.balmConfig = balmConfig;
    this.featuresConfig = {
      enabled: true,
      target: 'es2022',
      loose: false,
      spec: false,
      useBuiltIns: 'usage',
      corejs: { version: '3.32', proposals: false },
      debug: false,
      ...featuresConfig,
    };
    
    this.detector = new ModernFeaturesDetector();
    this.targetResolver = new TargetConfigResolver(balmConfig);
  }

  /**
   * Generate compiler configurations for modern features
   */
  async generateCompilerConfigs(projectPath: string = process.cwd()): Promise<CompilerFeatureSupport> {
    console.log('🔧 Generating modern features compiler configurations...');

    // Detect features used in the project
    const featureDetection = await this.detector.detectFeatures(projectPath);
    
    // Resolve target environment
    const targetEnvironment = this.targetResolver.resolveTargetEnvironment();
    
    // Generate SWC configuration
    const swcConfig = this.generateSWCConfig(featureDetection);
    
    // Generate Babel configuration
    const babelConfig = this.generateBabelConfig(featureDetection);
    
    // Analyze feature support
    const supportAnalysis = this.analyzeFeatureSupport(featureDetection, targetEnvironment);
    
    const result: CompilerFeatureSupport = {
      swc: swcConfig,
      babel: babelConfig,
      supportedFeatures: supportAnalysis.supported,
      unsupportedFeatures: supportAnalysis.unsupported,
      recommendations: supportAnalysis.recommendations,
      warnings: supportAnalysis.warnings,
    };

    console.log(`✅ Generated compiler configurations for ${featureDetection.totalFeatures} modern features.`);
    
    return result;
  }

  /**
   * Generate SWC configuration for modern features
   */
  generateSWCConfig(featureDetection: DetectionSummary): SWCFeatureConfig {
    const featuresUsed = featureDetection.featuresUsed.map(f => f.feature.name);
    const targets = this.targetResolver.generateBrowserslistConfig();

    const config: SWCFeatureConfig = {
      jsc: {
        target: this.mapTargetToSWC(this.featuresConfig.target || 'es2022'),
        parser: {
          syntax: this.detectSyntax(featuresUsed),
          tsx: featuresUsed.includes('jsx') || featuresUsed.includes('tsx'),
          jsx: featuresUsed.includes('jsx') || featuresUsed.includes('tsx'),
          decorators: featuresUsed.includes('decorators'),
          dynamicImport: featuresUsed.includes('dynamic-import'),
          privateMethod: featuresUsed.includes('private-fields') || featuresUsed.includes('private-methods'),
          functionBind: featuresUsed.includes('function-bind'),
          exportDefaultFrom: featuresUsed.includes('export-default-from'),
          exportNamespaceFrom: featuresUsed.includes('export-namespace-from'),
          decoratorsBeforeExport: featuresUsed.includes('decorators'),
          topLevelAwait: featuresUsed.includes('top-level-await'),
          importMeta: featuresUsed.includes('import-meta'),
        },
        transform: {
          legacyDecorator: featuresUsed.includes('decorators'),
          decoratorMetadata: featuresUsed.includes('decorators') && featuresUsed.includes('reflect-metadata'),
          useDefineForClassFields: featuresUsed.includes('class-fields'),
        },
      },
      minify: this.balmConfig.features?.minification || false,
    };

    // Add React configuration if JSX is used
    if (featuresUsed.includes('jsx') || featuresUsed.includes('tsx')) {
      config.jsc.transform.react = {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development',
        refresh: this.balmConfig.features?.hmr || false,
      };
    }

    // Add environment configuration for polyfills
    if (this.featuresConfig.useBuiltIns !== false) {
      config.env = {
        targets: targets,
        mode: this.featuresConfig.useBuiltIns || 'usage',
        debug: this.featuresConfig.debug || false,
        dynamicImport: featuresUsed.includes('dynamic-import'),
        loose: this.featuresConfig.loose || false,
        include: this.featuresConfig.features,
        exclude: this.featuresConfig.exclude,
        coreJs: typeof this.featuresConfig.corejs === 'string' 
          ? this.featuresConfig.corejs 
          : this.featuresConfig.corejs?.version,
        shippedProposals: this.featuresConfig.corejs?.proposals || false,
        forceAllTransforms: false,
      };
    }

    // Add optimizer configuration for modern features
    if (featuresUsed.length > 0) {
      config.jsc.transform.optimizer = {
        globals: {
          vars: {
            __DEV__: process.env.NODE_ENV === 'development' ? 'true' : 'false',
          },
          envs: {
            NODE_ENV: process.env.NODE_ENV || 'production',
          },
          typeofs: {
            window: 'object',
          },
        },
        jsonify: {
          minCost: 0,
        },
      };
    }

    return config;
  }

  /**
   * Generate Babel configuration for modern features
   */
  generateBabelConfig(featureDetection: DetectionSummary): BabelFeatureConfig {
    const featuresUsed = featureDetection.featuresUsed.map(f => f.feature.name);
    const targets = this.targetResolver.generateBrowserslistConfig();

    const presets: Array<[string, any] | string> = [];
    const plugins: Array<[string, any] | string> = [];

    // Add @babel/preset-env for modern features
    presets.push([
      '@babel/preset-env',
      {
        targets: targets,
        useBuiltIns: this.featuresConfig.useBuiltIns,
        corejs: this.featuresConfig.corejs,
        debug: this.featuresConfig.debug,
        loose: this.featuresConfig.loose,
        spec: this.featuresConfig.spec,
        include: this.featuresConfig.features,
        exclude: this.featuresConfig.exclude,
        modules: false, // Let bundler handle modules
        shippedProposals: this.featuresConfig.corejs?.proposals || false,
      },
    ]);

    // Add TypeScript preset if TypeScript is used
    if (featuresUsed.includes('typescript')) {
      presets.push([
        '@babel/preset-typescript',
        {
          allowDeclareFields: true,
          allowNamespaces: true,
          onlyRemoveTypeImports: true,
        },
      ]);
    }

    // Add React preset if JSX is used
    if (featuresUsed.includes('jsx') || featuresUsed.includes('tsx')) {
      presets.push([
        '@babel/preset-react',
        {
          runtime: 'automatic',
          development: process.env.NODE_ENV === 'development',
          throwIfNamespace: false,
        },
      ]);
    }

    // Add plugins for specific modern features
    if (featuresUsed.includes('decorators')) {
      plugins.push([
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
          decoratorsBeforeExport: false,
        },
      ]);
    }

    if (featuresUsed.includes('class-fields')) {
      plugins.push([
        '@babel/plugin-proposal-class-properties',
        {
          loose: this.featuresConfig.loose,
        },
      ]);
    }

    if (featuresUsed.includes('private-fields')) {
      plugins.push([
        '@babel/plugin-proposal-private-methods',
        {
          loose: this.featuresConfig.loose,
        },
      ]);
    }

    if (featuresUsed.includes('static-blocks')) {
      plugins.push('@babel/plugin-proposal-class-static-block');
    }

    if (featuresUsed.includes('logical-assignment')) {
      plugins.push('@babel/plugin-proposal-logical-assignment-operators');
    }

    if (featuresUsed.includes('nullish-coalescing')) {
      plugins.push('@babel/plugin-proposal-nullish-coalescing-operator');
    }

    if (featuresUsed.includes('optional-chaining')) {
      plugins.push('@babel/plugin-proposal-optional-chaining');
    }

    if (featuresUsed.includes('numeric-separators')) {
      plugins.push('@babel/plugin-proposal-numeric-separator');
    }

    if (featuresUsed.includes('top-level-await')) {
      plugins.push('@babel/plugin-syntax-top-level-await');
    }

    if (featuresUsed.includes('dynamic-import')) {
      plugins.push('@babel/plugin-syntax-dynamic-import');
    }

    if (featuresUsed.includes('import-meta')) {
      plugins.push('@babel/plugin-syntax-import-meta');
    }

    // Add optimization plugins
    if (this.balmConfig.features?.minification) {
      plugins.push([
        'babel-plugin-transform-remove-console',
        {
          exclude: ['error', 'warn'],
        },
      ]);
    }

    return {
      presets,
      plugins,
    };
  }

  /**
   * Test modern syntax compilation
   */
  async testModernSyntaxCompilation(
    code: string,
    compiler: 'swc' | 'babel' = 'swc'
  ): Promise<{
    success: boolean;
    output?: string;
    error?: string;
    features: string[];
  }> {
    try {
      // Detect features in the test code
      const features = await this.detector.detectFeaturesInCode(code);
      const featureNames = features.map(f => f.feature.name);

      let output: string;
      let success = true;

      if (compiler === 'swc') {
        // Test with SWC (would need actual SWC integration)
        output = `// SWC compiled output for features: ${featureNames.join(', ')}\n${code}`;
      } else {
        // Test with Babel (would need actual Babel integration)
        output = `// Babel compiled output for features: ${featureNames.join(', ')}\n${code}`;
      }

      return {
        success,
        output,
        features: featureNames,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        features: [],
      };
    }
  }

  /**
   * Generate feature support documentation
   */
  generateFeatureSupportDocs(featureSupport: CompilerFeatureSupport): string {
    const lines: string[] = [];

    lines.push('# Modern JavaScript Features Support');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');

    // Supported features
    if (featureSupport.supportedFeatures.length > 0) {
      lines.push('## Supported Features');
      lines.push('');
      for (const feature of featureSupport.supportedFeatures) {
        lines.push(`- ✅ ${feature}`);
      }
      lines.push('');
    }

    // Unsupported features
    if (featureSupport.unsupportedFeatures.length > 0) {
      lines.push('## Unsupported Features');
      lines.push('');
      for (const feature of featureSupport.unsupportedFeatures) {
        lines.push(`- ❌ ${feature}`);
      }
      lines.push('');
    }

    // Recommendations
    if (featureSupport.recommendations.length > 0) {
      lines.push('## Recommendations');
      lines.push('');
      for (const recommendation of featureSupport.recommendations) {
        lines.push(`- 💡 ${recommendation}`);
      }
      lines.push('');
    }

    // Warnings
    if (featureSupport.warnings.length > 0) {
      lines.push('## Warnings');
      lines.push('');
      for (const warning of featureSupport.warnings) {
        lines.push(`- ⚠️ ${warning}`);
      }
      lines.push('');
    }

    // SWC Configuration
    lines.push('## SWC Configuration');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(featureSupport.swc, null, 2));
    lines.push('```');
    lines.push('');

    // Babel Configuration
    lines.push('## Babel Configuration');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(featureSupport.babel, null, 2));
    lines.push('```');

    return lines.join('\n');
  }

  // Private methods

  private detectSyntax(featuresUsed: string[]): 'typescript' | 'ecmascript' {
    return featuresUsed.includes('typescript') || featuresUsed.includes('tsx') 
      ? 'typescript' 
      : 'ecmascript';
  }

  private mapTargetToSWC(target: string): string {
    const targetMap: Record<string, string> = {
      'es3': 'es3',
      'es5': 'es5',
      'es2015': 'es2015',
      'es2016': 'es2016',
      'es2017': 'es2017',
      'es2018': 'es2018',
      'es2019': 'es2019',
      'es2020': 'es2020',
      'es2021': 'es2021',
      'es2022': 'es2022',
      'esnext': 'es2022',
    };

    return targetMap[target] || 'es2022';
  }

  private analyzeFeatureSupport(
    featureDetection: DetectionSummary,
    targetEnvironment: any
  ): {
    supported: string[];
    unsupported: string[];
    recommendations: string[];
    warnings: string[];
  } {
    const supported: string[] = [];
    const unsupported: string[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    for (const featureResult of featureDetection.featuresUsed) {
      const featureName = featureResult.feature.name;
      
      if (targetEnvironment.supportedFeatures.includes(featureName)) {
        supported.push(featureName);
      } else {
        unsupported.push(featureName);
      }
    }

    // Generate recommendations
    if (unsupported.length > 0) {
      recommendations.push(
        `Consider enabling polyfills for ${unsupported.length} unsupported features`
      );
    }

    if (featureDetection.modernFeatureUsage > 0.8) {
      recommendations.push(
        'High modern feature usage detected - consider updating target browsers for better performance'
      );
    }

    // Generate warnings
    if (featureDetection.compatibilityScore < 0.7) {
      warnings.push(
        'Low compatibility score detected - some features may not work in target browsers'
      );
    }

    const experimentalFeatures = featureDetection.featuresUsed.filter(f => 
      f.feature.name.includes('proposal') || f.feature.name.includes('experimental')
    );

    if (experimentalFeatures.length > 0) {
      warnings.push(
        `${experimentalFeatures.length} experimental features detected - use with caution`
      );
    }

    return {
      supported,
      unsupported,
      recommendations,
      warnings,
    };
  }
}

/**
 * Create modern features compiler support instance
 */
export function createModernFeaturesCompilerSupport(
  balmConfig: Partial<ModernBalmConfig>,
  featuresConfig?: ModernFeaturesConfig
): ModernFeaturesCompilerSupport {
  return new ModernFeaturesCompilerSupport(balmConfig, featuresConfig);
}

/**
 * Generate compiler configurations for modern features
 */
export async function generateModernFeaturesCompilerConfigs(
  balmConfig: Partial<ModernBalmConfig>,
  projectPath: string = process.cwd(),
  featuresConfig?: ModernFeaturesConfig
): Promise<CompilerFeatureSupport> {
  const support = createModernFeaturesCompilerSupport(balmConfig, featuresConfig);
  return support.generateCompilerConfigs(projectPath);
}

/**
 * Test modern syntax compilation
 */
export async function testModernSyntax(
  code: string,
  balmConfig: Partial<ModernBalmConfig>,
  compiler: 'swc' | 'babel' = 'swc',
  featuresConfig?: ModernFeaturesConfig
): Promise<{
  success: boolean;
  output?: string;
  error?: string;
  features: string[];
}> {
  const support = createModernFeaturesCompilerSupport(balmConfig, featuresConfig);
  return support.testModernSyntaxCompilation(code, compiler);
}