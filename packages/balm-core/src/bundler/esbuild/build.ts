import { build } from 'esbuild';
import { BalmError } from '@balm-core/index';

const minifyOptions = {
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true
};

const esBuild = (
  input: string[],
  output: string,
  customOptions: any,
  callback: Function
): void => {
  const defaultBuildOptions = {
    entryPoints: BalmJS.file.absPaths(input),
    outdir: BalmJS.file.absPath(output),
    bundle: true,
    logLevel: 'silent'
  };

  const buildOptions = BalmJS.config.env.isProd
    ? Object.assign(defaultBuildOptions, minifyOptions)
    : defaultBuildOptions;

  const esbuildOptions = Object.assign(
    buildOptions,
    BalmJS.config.scripts.buildOptions,
    customOptions
  );

  BalmJS.logger.debug(
    'esbuild bundler',
    {
      input: esbuildOptions.entryPoints,
      output: esbuildOptions.outdir
    },
    {
      pre: true
    }
  );

  BalmJS.logger.success('esbuild options', esbuildOptions, {
    pre: true
  });

  build(esbuildOptions)
    .catch((error: BalmError) => {
      BalmJS.logger.error('esbuild', error.message);
    })
    .finally(() => {
      // Done processing
      callback();
    });
};

export default esBuild;
