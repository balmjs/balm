import { describe, it, expect } from 'vitest';
import { resolveConfig, createDefaultConfig } from 'balm-core';
import path from 'node:path';

describe('Config Subsystem', () => {
  it('should initialize with standard default values', () => {
    const config = createDefaultConfig('/test-workspace');
    expect(config.roots.source).toBe('src');
    expect(config.roots.target).toBe('dist');
    expect(config.roots.tmp).toBe('.tmp');
    expect(config.styles.extname).toBe('scss');
    expect(config.scripts.bundler).toBe('webpack');
    expect(config.inFrontend).toBe(true);
  });

  it('should resolve customized paths and options correctly', () => {
    const customConfig = {
      workspace: '/custom-app',
      roots: {
        source: 'app',
        target: 'build'
      },
      styles: {
        extname: 'less'
      }
    };

    const config = resolveConfig(customConfig);
    expect(config.workspace).toBe('/custom-app');
    expect(config.roots.source).toBe('app');
    expect(config.roots.target).toBe('build');
    expect(config.styles.extname).toBe('less');
    expect(config.src.base).toBe(path.join('/custom-app', 'app'));
  });

  it('should adjust dest paths based on production vs development mode', () => {
    const devConfig = resolveConfig({
      workspace: '/app',
      env: { isProd: false, isDev: true, isTest: false, inFrontend: true, inSSR: false, inDesktopApp: false, isMP: false }
    });
    expect(devConfig.dest.base).toBe(path.join('/app', '.tmp'));

    const prodConfig = resolveConfig({
      workspace: '/app',
      env: { isProd: true, isDev: false, isTest: false, inFrontend: true, inSSR: false, inDesktopApp: false, isMP: false }
    });
    expect(prodConfig.dest.base).toBe(path.join('/app', 'dist'));
  });
});
