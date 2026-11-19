import * as esbuild from 'esbuild';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';
import { resolveDefaultEntry } from '../utilities/file.js';

export interface EsbuildIncrementalRunner {
  rebuild: () => Promise<esbuild.BuildResult>;
  dispose: () => Promise<void>;
}

export function buildEsbuildOptions(
  config: BalmConfig,
  customOptions: esbuild.BuildOptions = {}
): esbuild.BuildOptions {
  const isProd = config.env.isProd;

  let entryPoints = customOptions.entryPoints || config.scripts.entry;
  if (!entryPoints) {
    entryPoints = [resolveDefaultEntry(config.src.js)];
  }

  return {
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
}

export async function runEsbuild(
  config: BalmConfig,
  customOptions: esbuild.BuildOptions = {}
): Promise<esbuild.BuildResult> {
  const options = buildEsbuildOptions(config, customOptions);

  try {
    return await esbuild.build(options);
  } catch (err: any) {
    logger.error('esbuild', err.message || err);
    throw err;
  }
}

export async function createEsbuildRunner(
  config: BalmConfig,
  customOptions: esbuild.BuildOptions = {}
): Promise<EsbuildIncrementalRunner> {
  const options = buildEsbuildOptions(config, customOptions);
  const ctx = await esbuild.context(options);

  return {
    async rebuild(): Promise<esbuild.BuildResult> {
      try {
        return await ctx.rebuild();
      } catch (err: any) {
        logger.error('esbuild', err.message || err);
        throw err;
      }
    },
    async dispose(): Promise<void> {
      await ctx.dispose();
    }
  };
}
