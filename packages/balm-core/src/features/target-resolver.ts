/**
 * Target environment configuration resolver for BalmJS
 * Handles browser and Node.js target environment resolution and feature detection
 */

import browserslist from 'browserslist';
import { ModernBalmConfig } from '../config/modern.js';

/**
 * Target environment configuration
 */
export interface TargetEnvironment {
  browsers: string[];
  node?: string;
  esVersion: string;
  supportedFeatures: string[];
  polyfillsNeeded: string[];
}

/**
 * Browser capability information
 */
export interface BrowserCapability {
  name: string;
  version: string;
  supportedFeatures: Set<string>;
  requiredPolyfills: Set<string>;
}

/**
 * Feature support matrix
 */
export interface FeatureSupportMatrix {
  [feature: string]: {
    chrome?: number;
    firefox?: number;
    safari?: number;
    edge?: number;
    node?: string;
    description: string;
    polyfill?: string;
  };
}

/**
 * Target configuration resolver
 */
export class TargetConfigResolver {
  private balmConfig: Partial<ModernBalmConfig>;
  private featureMatrix: FeatureSupportMatrix;

  constructor(balmConfig: Partial<ModernBalmConfig>) {
    this.balmConfig = balmConfig;
    this.featureMatrix = this.createFeatureSupportMatrix();
  }

  /**
   * Resolve target environment configuration
   */
  resolveTargetEnvironment(): TargetEnvironment {
    const browsers = this.resolveBrowserTargets();
    const node = this.resolveNodeTarget();
    const esVersion = this.resolveESVersion(browsers, node);
    const supportedFeatures = this.detectSupportedFeatures(browsers, node);
    const polyfillsNeeded = this.detectRequiredPolyfills(browsers, node, supportedFeatures);

    return {
      browsers,
      node,
      esVersion,
      supportedFeatures,
      polyfillsNeeded,
    };
  }

  /**
   * Get browser capabilities for target browsers
   */
  getBrowserCapabilities(): BrowserCapability[] {
    const browsers = this.resolveBrowserTargets();
    const capabilities: BrowserCapability[] = [];

    // Parse browserslist output
    const browserList = browserslist(browsers);
    
    for (const browser of browserList) {
      const [name, version] = browser.split(' ');
      const capability = this.analyzeBrowserCapability(name, version);
      capabilities.push(capability);
    }

    return capabilities;
  }

  /**
   * Check if a specific feature is supported by target environments
   */
  isFeatureSupported(feature: string): boolean {
    const browsers = this.resolveBrowserTargets();
    const node = this.resolveNodeTarget();
    
    return this.checkFeatureSupport(feature, browsers, node);
  }

  /**
   * Get required polyfills for target environments
   */
  getRequiredPolyfills(): string[] {
    const browsers = this.resolveBrowserTargets();
    const node = this.resolveNodeTarget();
    const supportedFeatures = this.detectSupportedFeatures(browsers, node);
    
    return this.detectRequiredPolyfills(browsers, node, supportedFeatures);
  }

  /**
   * Get recommended ES version for target environments
   */
  getRecommendedESVersion(): string {
    const browsers = this.resolveBrowserTargets();
    const node = this.resolveNodeTarget();
    
    return this.resolveESVersion(browsers, node);
  }

  /**
   * Generate browserslist configuration
   */
  generateBrowserslistConfig(): string[] {
    const target = this.balmConfig.target;
    
    if (target?.browsers) {
      return Array.isArray(target.browsers) ? target.browsers : [target.browsers];
    }

    // Default configuration based on project type
    const projectType = this.detectProjectType();
    
    switch (projectType) {
      case 'modern':
        return [
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Safari versions',
          'last 2 Edge versions',
        ];
      case 'legacy':
        return [
          '> 0.5%',
          'last 2 versions',
          'Firefox ESR',
          'not dead',
          'not IE 11',
        ];
      case 'library':
        return [
          '> 1%',
          'last 3 versions',
          'Firefox ESR',
          'not dead',
        ];
      default:
        return ['defaults'];
    }
  }

  // Private methods

  private resolveBrowserTargets(): string[] {
    const target = this.balmConfig.target;
    
    if (target?.browsers) {
      return Array.isArray(target.browsers) ? target.browsers : [target.browsers];
    }

    return this.generateBrowserslistConfig();
  }

  private resolveNodeTarget(): string | undefined {
    const target = this.balmConfig.target;
    
    if (target?.node) {
      return target.node;
    }

    // Auto-detect Node.js version if building for Node.js
    if (this.isNodeProject()) {
      return this.detectNodeVersion();
    }

    return undefined;
  }

  private resolveESVersion(browsers: string[], node?: string): string {
    // If explicitly configured
    if (this.balmConfig.target?.esVersion) {
      return this.balmConfig.target.esVersion;
    }

    // Determine based on browser support
    const browserList = browserslist(browsers);
    const minESVersion = this.calculateMinESVersion(browserList, node);
    
    return minESVersion;
  }

  private detectSupportedFeatures(browsers: string[], node?: string): string[] {
    const supportedFeatures: string[] = [];
    
    for (const [feature, support] of Object.entries(this.featureMatrix)) {
      if (this.checkFeatureSupport(feature, browsers, node)) {
        supportedFeatures.push(feature);
      }
    }
    
    return supportedFeatures;
  }

  private detectRequiredPolyfills(
    browsers: string[], 
    node: string | undefined, 
    supportedFeatures: string[]
  ): string[] {
    const polyfills: Set<string> = new Set();
    
    // Check which features need polyfills
    for (const [feature, support] of Object.entries(this.featureMatrix)) {
      if (!supportedFeatures.includes(feature) && support.polyfill) {
        polyfills.add(support.polyfill);
      }
    }
    
    return Array.from(polyfills);
  }

  private checkFeatureSupport(feature: string, browsers: string[], node?: string): boolean {
    const support = this.featureMatrix[feature];
    if (!support) return false;

    // Check browser support
    const browserList = browserslist(browsers);
    const browserSupport = this.checkBrowserSupport(browserList, support);
    
    // Check Node.js support if applicable
    const nodeSupport = node ? this.checkNodeSupport(node, support) : true;
    
    return browserSupport && nodeSupport;
  }

  private checkBrowserSupport(browserList: string[], support: any): boolean {
    for (const browser of browserList) {
      const [name, version] = browser.split(' ');
      const versionNum = parseFloat(version);
      
      switch (name.toLowerCase()) {
        case 'chrome':
        case 'and_chr':
          if (support.chrome && versionNum < support.chrome) return false;
          break;
        case 'firefox':
        case 'and_ff':
          if (support.firefox && versionNum < support.firefox) return false;
          break;
        case 'safari':
        case 'ios_saf':
          if (support.safari && versionNum < support.safari) return false;
          break;
        case 'edge':
          if (support.edge && versionNum < support.edge) return false;
          break;
      }
    }
    
    return true;
  }

  private checkNodeSupport(nodeVersion: string, support: any): boolean {
    if (!support.node) return true;
    
    const targetVersion = parseFloat(nodeVersion);
    const requiredVersion = parseFloat(support.node);
    
    return targetVersion >= requiredVersion;
  }

  private calculateMinESVersion(browserList: string[], node?: string): string {
    let minVersion = 'es5';
    
    // Analyze browser capabilities
    const capabilities = this.analyzeBrowserListCapabilities(browserList);
    
    if (capabilities.supportsES2015) minVersion = 'es2015';
    if (capabilities.supportsES2016) minVersion = 'es2016';
    if (capabilities.supportsES2017) minVersion = 'es2017';
    if (capabilities.supportsES2018) minVersion = 'es2018';
    if (capabilities.supportsES2019) minVersion = 'es2019';
    if (capabilities.supportsES2020) minVersion = 'es2020';
    if (capabilities.supportsES2021) minVersion = 'es2021';
    if (capabilities.supportsES2022) minVersion = 'es2022';
    
    // Consider Node.js version
    if (node) {
      const nodeESVersion = this.getNodeESVersion(node);
      if (this.compareESVersions(nodeESVersion, minVersion) < 0) {
        minVersion = nodeESVersion;
      }
    }
    
    return minVersion;
  }

  private analyzeBrowserListCapabilities(browserList: string[]): any {
    const capabilities = {
      supportsES2015: true,
      supportsES2016: true,
      supportsES2017: true,
      supportsES2018: true,
      supportsES2019: true,
      supportsES2020: true,
      supportsES2021: true,
      supportsES2022: true,
    };
    
    for (const browser of browserList) {
      const [name, version] = browser.split(' ');
      const versionNum = parseFloat(version);
      const browserCaps = this.getBrowserESSupport(name, versionNum);
      
      // Take intersection of capabilities
      for (const key of Object.keys(capabilities)) {
        (capabilities as any)[key] = (capabilities as any)[key] && (browserCaps as any)[key];
      }
    }
    
    return capabilities;
  }

  private getBrowserESSupport(browserName: string, version: number): any {
    const support = {
      supportsES2015: false,
      supportsES2016: false,
      supportsES2017: false,
      supportsES2018: false,
      supportsES2019: false,
      supportsES2020: false,
      supportsES2021: false,
      supportsES2022: false,
    };
    
    switch (browserName.toLowerCase()) {
      case 'chrome':
      case 'and_chr':
        support.supportsES2015 = version >= 51;
        support.supportsES2016 = version >= 52;
        support.supportsES2017 = version >= 55;
        support.supportsES2018 = version >= 64;
        support.supportsES2019 = version >= 73;
        support.supportsES2020 = version >= 80;
        support.supportsES2021 = version >= 85;
        support.supportsES2022 = version >= 94;
        break;
        
      case 'firefox':
      case 'and_ff':
        support.supportsES2015 = version >= 54;
        support.supportsES2016 = version >= 48;
        support.supportsES2017 = version >= 52;
        support.supportsES2018 = version >= 58;
        support.supportsES2019 = version >= 62;
        support.supportsES2020 = version >= 72;
        support.supportsES2021 = version >= 80;
        support.supportsES2022 = version >= 93;
        break;
        
      case 'safari':
      case 'ios_saf':
        support.supportsES2015 = version >= 10;
        support.supportsES2016 = version >= 10.1;
        support.supportsES2017 = version >= 10.1;
        support.supportsES2018 = version >= 11.1;
        support.supportsES2019 = version >= 12;
        support.supportsES2020 = version >= 13.1;
        support.supportsES2021 = version >= 14;
        support.supportsES2022 = version >= 15.4;
        break;
        
      case 'edge':
        support.supportsES2015 = version >= 14;
        support.supportsES2016 = version >= 14;
        support.supportsES2017 = version >= 15;
        support.supportsES2018 = version >= 79;
        support.supportsES2019 = version >= 79;
        support.supportsES2020 = version >= 80;
        support.supportsES2021 = version >= 85;
        support.supportsES2022 = version >= 94;
        break;
    }
    
    return support;
  }

  private getNodeESVersion(nodeVersion: string): string {
    const version = parseFloat(nodeVersion);
    
    if (version >= 18) return 'es2022';
    if (version >= 16) return 'es2021';
    if (version >= 14) return 'es2020';
    if (version >= 12) return 'es2019';
    if (version >= 10) return 'es2018';
    if (version >= 8) return 'es2017';
    if (version >= 6) return 'es2015';
    
    return 'es5';
  }

  private compareESVersions(version1: string, version2: string): number {
    const versionOrder = ['es5', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'es2022', 'esnext'];
    const index1 = versionOrder.indexOf(version1);
    const index2 = versionOrder.indexOf(version2);
    
    return index1 - index2;
  }

  private analyzeBrowserCapability(name: string, version: string): BrowserCapability {
    const versionNum = parseFloat(version);
    const supportedFeatures = new Set<string>();
    const requiredPolyfills = new Set<string>();
    
    // Analyze features supported by this browser version
    for (const [feature, support] of Object.entries(this.featureMatrix)) {
      const isSupported = this.isBrowserFeatureSupported(name, versionNum, support);
      
      if (isSupported) {
        supportedFeatures.add(feature);
      } else if (support.polyfill) {
        requiredPolyfills.add(support.polyfill);
      }
    }
    
    return {
      name,
      version,
      supportedFeatures,
      requiredPolyfills,
    };
  }

  private isBrowserFeatureSupported(browserName: string, version: number, support: any): boolean {
    switch (browserName.toLowerCase()) {
      case 'chrome':
      case 'and_chr':
        return !support.chrome || version >= support.chrome;
      case 'firefox':
      case 'and_ff':
        return !support.firefox || version >= support.firefox;
      case 'safari':
      case 'ios_saf':
        return !support.safari || version >= support.safari;
      case 'edge':
        return !support.edge || version >= support.edge;
      default:
        return false;
    }
  }

  private detectProjectType(): 'modern' | 'legacy' | 'library' {
    // Detect based on configuration
    if ((this.balmConfig as any).library) return 'library';
    if ((this.balmConfig.features as any)?.legacySupport) return 'legacy';
    if (this.balmConfig.features?.modernSyntax) return 'modern';
    
    // Default to modern
    return 'modern';
  }

  private isNodeProject(): boolean {
    return (this.balmConfig.target as any)?.platform === 'node' || 
           (this.balmConfig as any).library?.target === 'node';
  }

  private detectNodeVersion(): string {
    // Try to detect from package.json engines field
    try {
      const pkg = require(process.cwd() + '/package.json');
      if (pkg.engines?.node) {
        const nodeVersion = pkg.engines.node.replace(/[^\d.]/g, '');
        return nodeVersion;
      }
    } catch {
      // Ignore errors
    }
    
    // Default to current Node.js version
    return process.version.replace('v', '');
  }

  private createFeatureSupportMatrix(): FeatureSupportMatrix {
    return {
      // ES2015 features
      'arrow-functions': {
        chrome: 45,
        firefox: 22,
        safari: 10,
        edge: 12,
        node: '4.0',
        description: 'Arrow functions',
      },
      'classes': {
        chrome: 49,
        firefox: 45,
        safari: 10.1,
        edge: 13,
        node: '6.0',
        description: 'ES6 Classes',
      },
      'template-literals': {
        chrome: 41,
        firefox: 34,
        safari: 9,
        edge: 12,
        node: '4.0',
        description: 'Template literals',
      },
      'destructuring': {
        chrome: 49,
        firefox: 41,
        safari: 10,
        edge: 14,
        node: '6.0',
        description: 'Destructuring assignment',
      },
      'spread-operator': {
        chrome: 46,
        firefox: 16,
        safari: 10,
        edge: 12,
        node: '5.0',
        description: 'Spread operator',
      },
      'const-let': {
        chrome: 49,
        firefox: 36,
        safari: 10,
        edge: 14,
        node: '6.0',
        description: 'Block-scoped declarations (let, const)',
      },
      
      // ES2016 features
      'exponentiation-operator': {
        chrome: 52,
        firefox: 52,
        safari: 10.1,
        edge: 14,
        node: '7.0',
        description: 'Exponentiation operator (**)',
      },
      'array-includes': {
        chrome: 47,
        firefox: 43,
        safari: 9,
        edge: 14,
        node: '6.0',
        description: 'Array.prototype.includes',
        polyfill: 'core-js/features/array/includes',
      },
      
      // ES2017 features
      'async-await': {
        chrome: 55,
        firefox: 52,
        safari: 10.1,
        edge: 15,
        node: '7.6',
        description: 'Async/await',
      },
      'object-values-entries': {
        chrome: 54,
        firefox: 47,
        safari: 10.1,
        edge: 14,
        node: '7.0',
        description: 'Object.values/Object.entries',
        polyfill: 'core-js/features/object',
      },
      'string-padding': {
        chrome: 57,
        firefox: 48,
        safari: 10,
        edge: 15,
        node: '8.0',
        description: 'String padding (padStart/padEnd)',
        polyfill: 'core-js/features/string/pad-start',
      },
      
      // ES2018 features
      'async-iteration': {
        chrome: 63,
        firefox: 57,
        safari: 11.1,
        edge: 79,
        node: '10.0',
        description: 'Async iteration',
      },
      'object-spread': {
        chrome: 60,
        firefox: 55,
        safari: 11.1,
        edge: 79,
        node: '8.3',
        description: 'Object spread properties',
      },
      'promise-finally': {
        chrome: 63,
        firefox: 58,
        safari: 11.1,
        edge: 18,
        node: '10.0',
        description: 'Promise.prototype.finally',
        polyfill: 'core-js/features/promise/finally',
      },
      
      // ES2019 features
      'array-flat': {
        chrome: 69,
        firefox: 62,
        safari: 12,
        edge: 79,
        node: '11.0',
        description: 'Array.prototype.flat/flatMap',
        polyfill: 'core-js/features/array/flat',
      },
      'object-from-entries': {
        chrome: 73,
        firefox: 63,
        safari: 12.1,
        edge: 79,
        node: '12.0',
        description: 'Object.fromEntries',
        polyfill: 'core-js/features/object/from-entries',
      },
      'string-trim-start-end': {
        chrome: 66,
        firefox: 61,
        safari: 12,
        edge: 79,
        node: '10.0',
        description: 'String.prototype.trimStart/trimEnd',
        polyfill: 'core-js/features/string/trim-start',
      },
      
      // ES2020 features
      'optional-chaining': {
        chrome: 80,
        firefox: 72,
        safari: 13.1,
        edge: 80,
        node: '14.0',
        description: 'Optional chaining (?.)',
      },
      'nullish-coalescing': {
        chrome: 80,
        firefox: 72,
        safari: 13.1,
        edge: 80,
        node: '14.0',
        description: 'Nullish coalescing (??)',
      },
      'bigint': {
        chrome: 67,
        firefox: 68,
        safari: 14,
        edge: 79,
        node: '10.4',
        description: 'BigInt',
      },
      'dynamic-import': {
        chrome: 63,
        firefox: 67,
        safari: 11.1,
        edge: 79,
        node: '13.2',
        description: 'Dynamic import()',
      },
      'promise-allsettled': {
        chrome: 76,
        firefox: 71,
        safari: 13,
        edge: 79,
        node: '12.9',
        description: 'Promise.allSettled',
        polyfill: 'core-js/features/promise/all-settled',
      },
      
      // ES2021 features
      'logical-assignment': {
        chrome: 85,
        firefox: 79,
        safari: 14,
        edge: 85,
        node: '15.0',
        description: 'Logical assignment operators (??=, ||=, &&=)',
      },
      'numeric-separators': {
        chrome: 75,
        firefox: 70,
        safari: 13,
        edge: 79,
        node: '12.5',
        description: 'Numeric separators (1_000_000)',
      },
      'promise-any': {
        chrome: 85,
        firefox: 79,
        safari: 14,
        edge: 85,
        node: '15.0',
        description: 'Promise.any',
        polyfill: 'core-js/features/promise/any',
      },
      'string-replace-all': {
        chrome: 85,
        firefox: 77,
        safari: 13.1,
        edge: 85,
        node: '15.0',
        description: 'String.prototype.replaceAll',
        polyfill: 'core-js/features/string/replace-all',
      },
      
      // ES2022 features
      'class-fields': {
        chrome: 84,
        firefox: 90,
        safari: 14.1,
        edge: 84,
        node: '16.0',
        description: 'Class fields',
      },
      'private-fields': {
        chrome: 84,
        firefox: 90,
        safari: 14.1,
        edge: 84,
        node: '16.0',
        description: 'Private class fields (#field)',
      },
      'static-blocks': {
        chrome: 94,
        firefox: 93,
        safari: 15.4,
        edge: 94,
        node: '16.11',
        description: 'Static initialization blocks',
      },
      'top-level-await': {
        chrome: 89,
        firefox: 89,
        safari: 15,
        edge: 89,
        node: '14.8',
        description: 'Top-level await',
      },
      'array-at': {
        chrome: 92,
        firefox: 90,
        safari: 15.4,
        edge: 92,
        node: '16.6',
        description: 'Array.prototype.at',
        polyfill: 'core-js/features/array/at',
      },
      'object-hasown': {
        chrome: 99,
        firefox: 92,
        safari: 15.4,
        edge: 99,
        node: '16.9',
        description: 'Object.hasOwn',
        polyfill: 'core-js/features/object/has-own',
      },
    };
  }
}

/**
 * Create target config resolver instance
 */
export function createTargetResolver(balmConfig: Partial<ModernBalmConfig>): TargetConfigResolver {
  return new TargetConfigResolver(balmConfig);
}

/**
 * Resolve target environment for BalmJS configuration
 */
export function resolveTargetEnvironment(balmConfig: Partial<ModernBalmConfig>): TargetEnvironment {
  const resolver = new TargetConfigResolver(balmConfig);
  return resolver.resolveTargetEnvironment();
}

/**
 * Check if feature is supported by target environment
 */
export function isFeatureSupportedByTarget(
  feature: string, 
  balmConfig: Partial<ModernBalmConfig>
): boolean {
  const resolver = new TargetConfigResolver(balmConfig);
  return resolver.isFeatureSupported(feature);
}

/**
 * Get required polyfills for target environment
 */
export function getRequiredPolyfillsForTarget(balmConfig: Partial<ModernBalmConfig>): string[] {
  const resolver = new TargetConfigResolver(balmConfig);
  return resolver.getRequiredPolyfills();
}