import { rollup, RollupOptions, OutputOptions } from 'rollup';
import path from 'node:path';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';

export async function runRollup(
  config: BalmConfig,
  customInputOptions: RollupOptions = {},
  customOutputOptions: OutputOptions = {}
): Promise<void> {
  const isProd = config.env.isProd;

  let input = customInputOptions.input || config.scripts.entry;
  if (!input) {
    input = path.join(config.src.js, 'main.js');
  }

  const inputOptions: RollupOptions = {
    ...config.scripts.rollupOptions,
    ...customInputOptions,
    input: (customInputOptions.input || input) as any
  };

  const outputOptions: OutputOptions = customOutputOptions.file
    ? {
        format: 'es',
        sourcemap: !isProd,
        ...customOutputOptions
      }
    : {
        dir: config.dest.js,
        format: 'es',
        sourcemap: !isProd,
        ...customOutputOptions
      };

  try {
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
    await bundle.close();
  } catch (err: any) {
    logger.error('rollup', err.message || err);
    throw err;
  }
}
