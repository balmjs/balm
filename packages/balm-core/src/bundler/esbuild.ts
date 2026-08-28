import * as esbuild from 'esbuild';
import path from 'node:path';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';

export async function runEsbuild(
  config: BalmConfig,
  customOptions: esbuild.BuildOptions = {}
): Promise<esbuild.BuildResult> {
  const isProd = config.env.isProd;

  let entryPoints = customOptions.entryPoints || config.scripts.entry;
  if (!entryPoints) {
    entryPoints = [path.join(config.src.js, 'main.js')];
  }

  const defaultOptions: esbuild.BuildOptions = {
    entryPoints: (Array.isArray(entryPoints)
      ? entryPoints
      : typeof entryPoints === 'string'
        ? [entryPoints]
        : entryPoints) as any,
    absWorkingDir: config.workspace,
    bundle: true,
    outdir: config.dest.js,
    alias: {
      ...config.alias,
      ...config.scripts.alias
    },
    minify: isProd || config.scripts.minify,
    sourcemap: !isProd,
    target:
      config.scripts.target && config.scripts.target !== 'web'
        ? (config.scripts.target as string)
        : 'es2020',
    format: 'esm',
    ...config.scripts.esbuildOptions,
    ...customOptions
  };

  try {
    return await esbuild.build(defaultOptions);
  } catch (err: any) {
    logger.error('esbuild', err.message || err);
    throw err;
  }
}
