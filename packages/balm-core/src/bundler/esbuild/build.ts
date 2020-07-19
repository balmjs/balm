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
    entryPoints: input.length
      ? BalmJS.file.absPaths(input)
      : [BalmJS.file.absPath(BalmJS.file.defaultEntry)],
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
