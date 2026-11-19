import { describe, it, expect, vi } from 'vitest';
import {
  resolveConfig,
  createDefaultConfig,
  resolveServerHost,
  getNetworkAddresses,
  ServerTask
} from 'balm-core';
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

  it('should resolve extras configuration correctly', () => {
    const config = resolveConfig({
      workspace: '/app',
      extras: {
        includes: ['CNAME', 'custom.zip'],
        excludes: ['temp.js']
      }
    });
    expect(config.extras?.includes).toEqual(['CNAME', 'custom.zip']);
    expect(config.extras?.excludes).toEqual(['temp.js']);
  });

  it('should resolve server host across config, boolean, and env fallbacks', () => {
    expect(resolveServerHost(null, '')).toEqual({
      host: 'localhost',
      isWildcard: false
    });
    expect(resolveServerHost(true, '')).toEqual({
      host: '0.0.0.0',
      isWildcard: true
    });
    expect(resolveServerHost('::', '')).toEqual({
      host: '::',
      isWildcard: true
    });
    expect(resolveServerHost(null, '0.0.0.0')).toEqual({
      host: '0.0.0.0',
      isWildcard: true
    });
    expect(resolveServerHost(false, '0.0.0.0')).toEqual({
      host: 'localhost',
      isWildcard: false
    });
    expect(resolveServerHost('192.168.1.25', '')).toEqual({
      host: '192.168.1.25',
      isWildcard: false
    });
  });

  it('should start ServerTask on 0.0.0.0 and print network URLs when server.host is true', async () => {
    const config = resolveConfig({
      workspace: process.cwd(),
      env: { isProd: false, isDev: true, isTest: true },
      server: { host: true, port: 0 }
    });

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const task = new ServerTask();
    await task.run(config);

    const output = logSpy.mock.calls.map((args) => args.join(' ')).join('\n');
    logSpy.mockRestore();

    expect(output).toContain('Local:');
    expect(output).toContain('http://localhost:');
    expect(output).toContain('Network:');
    for (const ip of getNetworkAddresses()) {
      expect(output).toContain(`http://${ip}:`);
    }
  });
});
