import { build } from 'esbuild';
import { minifyOptions } from './options.js';
import { BuildOptions, BalmError } from '@balm-core/index';

const esBuild = (
  entryPoints: string[],
  output: string,
  customBuildOptions: BuildOptions,
  callback: Function
): void => {
  const defaultBuildOptions = {
    entryPoints: BalmJS.file.absPaths(entryPoints),
    outdir: BalmJS.file.absPath(output),
    bundle: BalmJS.config.env.isProd
  };

  const buildOptions = BalmJS.config.env.isProd
    ? Object.assign(defaultBuildOptions, minifyOptions)
    : defaultBuildOptions;

  const options = Object.assign(
    buildOptions,
    BalmJS.config.scripts.buildOptions,
    customBuildOptions
  );

  BalmJS.logger.debug(
    'esbuild bundler - build',
    {
      input: options.entryPoints,
      output: options.outdir
    },
    {
      pre: true
    }
  );

  BalmJS.logger.success('esbuild options', options, {
    pre: true
  });

  build(options)
    .catch((error: BalmError) => {
      BalmJS.logger.error('esbuild', error.message);
    })
    .finally(() => {
      callback();
    });
};

export default esBuild;
