/**
 * Vite HMR (Hot Module Replacement) and development experience enhancements for BalmJS
 * Provides fast refresh, error overlay, and development optimizations
 */

import { Plugin, ViteDevServer, HmrContext } from 'vite';
import { ModernBalmConfig } from '../../config/modern.js';
import path from 'node:path';
import fs from 'node:fs';

/**
 * HMR configuration options
 */
export interface HMRConfig {
  enabled?: boolean;
  port?: number;
  host?: string;
  clientPort?: number;
  overlay?: boolean;
  timeout?: number;
  acceptDeps?: string[];
  invalidateOnUpdate?: string[];
  customUpdateHandler?: (ctx: HmrContext) => void;
}

/**
 * Development experience configuration
 */
export interface DevExperienceConfig {
  fastRefresh?: boolean;
  errorOverlay?: boolean;
  progressBar?: boolean;
  notifications?: boolean;
  openBrowser?: boolean;
  clearConsole?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'silent';
  customMiddleware?: Array<(server: ViteDevServer) => void>;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  enabled?: boolean;
  threshold?: number;
  logSlowTransforms?: boolean;
  bundleAnalysis?: boolean;
  memoryMonitoring?: boolean;
}

/**
 * Vite HMR and development experience manager
 */
export class ViteHMRManager {
  private balmConfig: Partial<ModernBalmConfig>;
  private hmrConfig: HMRConfig;
  private devConfig: DevExperienceConfig;
  private perfConfig: PerformanceConfig;
  private server?: ViteDevServer;
  private startTime: number = 0;

  constructor(
    balmConfig: Partial<ModernBalmConfig>,
    hmrConfig: HMRConfig = {},
    devConfig: DevExperienceConfig = {},
    perfConfig: PerformanceConfig = {}
  ) {
    this.balmConfig = balmConfig;
    this.hmrConfig = {
      enabled: true,
      port: 24678,
      overlay: true,
      timeout: 30000,
      acceptDeps: [],
      invalidateOnUpdate: [],
      ...hmrConfig,
    };
    this.devConfig = {
      fastRefresh: true,
      errorOverlay: true,
      progressBar: true,
      notifications: true,
      openBrowser: false,
      clearConsole: false,
      logLevel: 'info',
      customMiddleware: [],
      ...devConfig,
    };
    this.perfConfig = {
      enabled: true,
      threshold: 1000,
      logSlowTransforms: true,
      bundleAnalysis: false,
      memoryMonitoring: false,
      ...perfConfig,
    };
  }

  /**
   * Create HMR enhancement plugin
   */
  createHMRPlugin(): Plugin {
    return {
      name: 'balm:hmr-enhancement',
      
      configureServer: (server) => {
        this.server = server;
        this.setupHMREnhancements(server);
        this.setupDevMiddleware(server);
        this.setupPerformanceMonitoring(server);
      },
      
      handleHotUpdate: (ctx) => {
        return this.handleHotUpdate(ctx);
      },
      
      buildStart: () => {
        this.startTime = Date.now();
        if (this.devConfig.progressBar) {
          console.log('🚀 Starting Vite development server...');
        }
      },
      
      buildEnd: () => {
        const duration = Date.now() - this.startTime;
        if (this.devConfig.progressBar) {
          console.log(`✅ Server ready in ${duration}ms`);
        }
      },
    };
  }

  /**
   * Create fast refresh plugin for React/Vue
   */
  createFastRefreshPlugin(): Plugin {
    const framework = this.balmConfig.framework?.name;
    
    return {
      name: 'balm:fast-refresh',
      
      configureServer: (server) => {
        if (!this.devConfig.fastRefresh) return;
        
        // Framework-specific fast refresh setup
        switch (framework) {
          case 'react':
            this.setupReactFastRefresh(server);
            break;
          case 'vue':
            this.setupVueFastRefresh(server);
            break;
          case 'svelte':
            this.setupSvelteFastRefresh(server);
            break;
        }
      },
      
      handleHotUpdate: (ctx) => {
        return this.handleFastRefreshUpdate(ctx);
      },
    };
  }

  /**
   * Create error overlay enhancement plugin
   */
  createErrorOverlayPlugin(): Plugin {
    return {
      name: 'balm:error-overlay',
      
      configureServer: (server) => {
        if (!this.devConfig.errorOverlay) return;
        
        // Enhanced error overlay
        server.ws.on('vite:error', (data) => {
          this.handleError(data);
        });
        
        // Custom error middleware
        server.middlewares.use('/__balm_error', (req, res, next) => {
          this.handleErrorRequest(req, res, next);
        });
      },
      
      transform: (code, id) => {
        try {
          return null; // Let other plugins handle transformation
        } catch (error) {
          this.reportTransformError(error, id);
          throw error;
        }
      },
    };
  }

  /**
   * Create development performance plugin
   */
  createPerformancePlugin(): Plugin {
    return {
      name: 'balm:dev-performance',
      
      configureServer: (server) => {
        if (!this.perfConfig.enabled) return;
        
        this.setupPerformanceTracking(server);
      },
      
      transform: (code, id) => {
        if (!this.perfConfig.logSlowTransforms) return null;
        
        const start = Date.now();
        return {
          code,
          map: null,
          meta: {
            transformTime: Date.now() - start,
          },
        };
      },
      
      generateBundle: () => {
        if (this.perfConfig.bundleAnalysis) {
          this.generatePerformanceReport();
        }
      },
    };
  }

  // Private methods

  private setupHMREnhancements(server: ViteDevServer): void {
    // Custom HMR message handlers
    server.ws.on('balm:ping', () => {
      server.ws.send('balm:pong', { timestamp: Date.now() });
    });

    server.ws.on('balm:reload-page', () => {
      server.ws.send({
        type: 'full-reload',
      });
    });

    server.ws.on('balm:clear-cache', () => {
      // Clear module cache
      server.moduleGraph.invalidateAll();
      server.ws.send('balm:cache-cleared', {});
    });

    // Enhanced file watching
    server.watcher.on('change', (file) => {
      this.handleFileChange(file, server);
    });

    server.watcher.on('add', (file) => {
      this.handleFileAdd(file, server);
    });

    server.watcher.on('unlink', (file) => {
      this.handleFileDelete(file, server);
    });
  }

  private setupDevMiddleware(server: ViteDevServer): void {
    // Development API endpoints
    server.middlewares.use('/api/__balm', (req, res, next) => {
      const url = req.url || '';
      
      if (url === '/health') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'ok',
          timestamp: Date.now(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
        }));
      } else if (url === '/config') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          framework: this.balmConfig.framework?.name,
          mode: this.balmConfig.mode,
          features: Object.keys(this.balmConfig.features || {}),
          hmr: this.hmrConfig,
        }));
      } else if (url === '/performance') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(this.getPerformanceMetrics()));
      } else {
        next();
      }
    });

    // Custom middleware from configuration
    this.devConfig.customMiddleware?.forEach(middleware => {
      middleware(server);
    });
  }

  private setupPerformanceMonitoring(server: ViteDevServer): void {
    if (!this.perfConfig.enabled) return;

    // Monitor memory usage
    if (this.perfConfig.memoryMonitoring) {
      setInterval(() => {
        const usage = process.memoryUsage();
        if (usage.heapUsed > 500 * 1024 * 1024) { // 500MB threshold
          console.warn('⚠️  High memory usage detected:', this.formatBytes(usage.heapUsed));
        }
      }, 30000);
    }

    // Monitor transform performance
    const originalTransform = server.transformRequest;
    server.transformRequest = async (url, options) => {
      const start = Date.now();
      const result = await originalTransform.call(server, url, options);
      const duration = Date.now() - start;
      
      if (duration > this.perfConfig.threshold!) {
        console.warn(`⚠️  Slow transform detected: ${url} (${duration}ms)`);
      }
      
      return result;
    };
  }

  private handleHotUpdate(ctx: HmrContext): void | Promise<void> {
    const { file, timestamp, server } = ctx;
    
    // Custom HMR logic based on file type
    const ext = path.extname(file);
    
    if (['.css', '.scss', '.sass', '.less', '.styl'].includes(ext)) {
      this.handleStyleUpdate(ctx);
    } else if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
      this.handleScriptUpdate(ctx);
    } else if (ext === '.vue') {
      this.handleVueUpdate(ctx);
    } else if (ext === '.svelte') {
      this.handleSvelteUpdate(ctx);
    }

    // Notify about the update
    if (this.devConfig.notifications) {
      console.log(`🔄 Updated: ${path.relative(process.cwd(), file)}`);
    }

    // Custom update handler
    if (this.hmrConfig.customUpdateHandler) {
      this.hmrConfig.customUpdateHandler(ctx);
    }
  }

  private handleFastRefreshUpdate(ctx: HmrContext): void {
    const { file } = ctx;
    const framework = this.balmConfig.framework?.name;
    
    // Framework-specific fast refresh logic
    switch (framework) {
      case 'react':
        if (this.isReactComponent(file)) {
          this.triggerReactFastRefresh(ctx);
        }
        break;
      case 'vue':
        if (file.endsWith('.vue')) {
          this.triggerVueFastRefresh(ctx);
        }
        break;
      case 'svelte':
        if (file.endsWith('.svelte')) {
          this.triggerSvelteFastRefresh(ctx);
        }
        break;
    }
  }

  private setupReactFastRefresh(server: ViteDevServer): void {
    // React Fast Refresh setup
    server.ws.on('react:fast-refresh', (data) => {
      server.ws.send({
        type: 'custom',
        event: 'react-fast-refresh',
        data,
      });
    });
  }

  private setupVueFastRefresh(server: ViteDevServer): void {
    // Vue HMR setup
    server.ws.on('vue:hmr', (data) => {
      server.ws.send({
        type: 'custom',
        event: 'vue-hmr',
        data,
      });
    });
  }

  private setupSvelteFastRefresh(server: ViteDevServer): void {
    // Svelte HMR setup
    server.ws.on('svelte:hmr', (data) => {
      server.ws.send({
        type: 'custom',
        event: 'svelte-hmr',
        data,
      });
    });
  }

  private handleFileChange(file: string, server: ViteDevServer): void {
    const relativePath = path.relative(process.cwd(), file);
    
    // Check if file should trigger full reload
    if (this.shouldTriggerFullReload(file)) {
      server.ws.send({
        type: 'full-reload',
      });
      return;
    }

    // Check for configuration file changes
    if (this.isConfigFile(file)) {
      console.log(`📝 Configuration file changed: ${relativePath}`);
      server.ws.send({
        type: 'full-reload',
      });
    }
  }

  private handleFileAdd(file: string, server: ViteDevServer): void {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`➕ File added: ${relativePath}`);
    
    // Invalidate module graph for new files
    server.moduleGraph.invalidateAll();
  }

  private handleFileDelete(file: string, server: ViteDevServer): void {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`➖ File deleted: ${relativePath}`);
    
    // Remove from module graph
    const module = server.moduleGraph.getModuleById(file);
    if (module) {
      server.moduleGraph.invalidateModule(module);
    }
  }

  private handleStyleUpdate(ctx: HmrContext): void {
    // Enhanced CSS HMR
    ctx.server.ws.send({
      type: 'update',
      updates: [{
        type: 'css-update',
        path: ctx.file,
        acceptedPath: ctx.file,
        timestamp: ctx.timestamp,
      }],
    });
  }

  private handleScriptUpdate(ctx: HmrContext): void {
    // Enhanced JavaScript HMR
    const modules = ctx.modules || [];
    
    modules.forEach(module => {
      ctx.server.ws.send({
        type: 'update',
        updates: [{
          type: 'js-update',
          path: module.file || ctx.file,
          acceptedPath: module.file || ctx.file,
          timestamp: ctx.timestamp,
        }],
      });
    });
  }

  private handleVueUpdate(ctx: HmrContext): void {
    // Vue-specific HMR handling
    ctx.server.ws.send({
      type: 'custom',
      event: 'vue-reload',
      data: {
        path: ctx.file,
        timestamp: ctx.timestamp,
      },
    });
  }

  private handleSvelteUpdate(ctx: HmrContext): void {
    // Svelte-specific HMR handling
    ctx.server.ws.send({
      type: 'custom',
      event: 'svelte-reload',
      data: {
        path: ctx.file,
        timestamp: ctx.timestamp,
      },
    });
  }

  private handleError(error: any): void {
    // Enhanced error handling
    const enhancedError = {
      ...error,
      timestamp: Date.now(),
      stack: error.stack,
      suggestions: this.generateErrorSuggestions(error),
    };

    // Send enhanced error to client
    this.server?.ws.send({
      type: 'error',
      err: enhancedError,
    });
  }

  private handleErrorRequest(req: any, res: any, next: any): void {
    // Custom error page handling
    res.setHeader('Content-Type', 'text/html');
    res.end(this.generateErrorPage());
  }

  private reportTransformError(error: any, id: string): void {
    console.error(`❌ Transform error in ${id}:`, error.message);
    
    if (this.devConfig.errorOverlay) {
      this.server?.ws.send({
        type: 'error',
        err: {
          message: error.message,
          stack: error.stack,
          id,
          loc: error.loc,
        },
      });
    }
  }

  private setupPerformanceTracking(server: ViteDevServer): void {
    // Track server startup time
    const startTime = Date.now();
    
    server.httpServer?.on('listening', () => {
      const duration = Date.now() - startTime;
      console.log(`⚡ Server started in ${duration}ms`);
    });
  }

  private generatePerformanceReport(): void {
    const report = {
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      metrics: this.getPerformanceMetrics(),
    };
    
    console.log('📊 Performance Report:', report);
  }

  private getPerformanceMetrics(): any {
    return {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }

  private isReactComponent(file: string): boolean {
    const content = fs.readFileSync(file, 'utf-8');
    return /export\s+default\s+function|export\s+default\s+class|export\s+default\s+\w+/.test(content) &&
           /jsx|tsx/.test(path.extname(file));
  }

  private triggerReactFastRefresh(ctx: HmrContext): void {
    ctx.server.ws.send({
      type: 'custom',
      event: 'react-fast-refresh',
      data: { path: ctx.file },
    });
  }

  private triggerVueFastRefresh(ctx: HmrContext): void {
    ctx.server.ws.send({
      type: 'custom',
      event: 'vue-hmr',
      data: { path: ctx.file },
    });
  }

  private triggerSvelteFastRefresh(ctx: HmrContext): void {
    ctx.server.ws.send({
      type: 'custom',
      event: 'svelte-hmr',
      data: { path: ctx.file },
    });
  }

  private shouldTriggerFullReload(file: string): boolean {
    const fullReloadPatterns = [
      /package\.json$/,
      /vite\.config\./,
      /balm\.config\./,
      /\.env$/,
      /\.env\./,
    ];
    
    return fullReloadPatterns.some(pattern => pattern.test(file));
  }

  private isConfigFile(file: string): boolean {
    const configPatterns = [
      /vite\.config\./,
      /balm\.config\./,
      /tsconfig\.json$/,
      /jsconfig\.json$/,
    ];
    
    return configPatterns.some(pattern => pattern.test(file));
  }

  private generateErrorSuggestions(error: any): string[] {
    const suggestions: string[] = [];
    
    if (error.message.includes('Cannot resolve module')) {
      suggestions.push('Check if the module is installed: npm install <module-name>');
      suggestions.push('Verify the import path is correct');
    }
    
    if (error.message.includes('Syntax error')) {
      suggestions.push('Check for missing brackets, semicolons, or quotes');
      suggestions.push('Verify the file syntax matches its extension');
    }
    
    if (error.message.includes('TypeScript')) {
      suggestions.push('Check TypeScript configuration in tsconfig.json');
      suggestions.push('Verify type definitions are available');
    }
    
    return suggestions;
  }

  private generateErrorPage(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>BalmJS Development Error</title>
  <style>
    body { font-family: monospace; padding: 20px; background: #1a1a1a; color: #fff; }
    .error { background: #ff6b6b; padding: 10px; border-radius: 4px; margin: 10px 0; }
    .suggestion { background: #4ecdc4; padding: 10px; border-radius: 4px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>🚨 Development Error</h1>
  <p>An error occurred during development. Check the console for details.</p>
  <button onclick="location.reload()">Reload Page</button>
</body>
</html>
    `;
  }

  private formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * Create HMR manager instance
 */
export function createHMRManager(
  balmConfig: Partial<ModernBalmConfig>,
  hmrConfig?: HMRConfig,
  devConfig?: DevExperienceConfig,
  perfConfig?: PerformanceConfig
): ViteHMRManager {
  return new ViteHMRManager(balmConfig, hmrConfig, devConfig, perfConfig);
}

/**
 * Create HMR enhancement plugins
 */
export function createHMRPlugins(
  balmConfig: Partial<ModernBalmConfig>,
  options: {
    hmr?: HMRConfig;
    dev?: DevExperienceConfig;
    performance?: PerformanceConfig;
  } = {}
): Plugin[] {
  const manager = createHMRManager(balmConfig, options.hmr, options.dev, options.performance);
  
  return [
    manager.createHMRPlugin(),
    manager.createFastRefreshPlugin(),
    manager.createErrorOverlayPlugin(),
    manager.createPerformancePlugin(),
  ];
}

/**
 * Default HMR configuration for different frameworks
 */
export const HMRPresets = {
  react: {
    hmr: { enabled: true, overlay: true },
    dev: { fastRefresh: true, errorOverlay: true, notifications: true },
    performance: { enabled: true, logSlowTransforms: true },
  },
  
  vue: {
    hmr: { enabled: true, overlay: true },
    dev: { fastRefresh: true, errorOverlay: true, notifications: true },
    performance: { enabled: true, logSlowTransforms: true },
  },
  
  svelte: {
    hmr: { enabled: true, overlay: true },
    dev: { fastRefresh: true, errorOverlay: true, notifications: true },
    performance: { enabled: true, logSlowTransforms: true },
  },
  
  vanilla: {
    hmr: { enabled: true, overlay: true },
    dev: { errorOverlay: true, notifications: true },
    performance: { enabled: true, logSlowTransforms: false },
  },
};