import { build } from 'esbuild';
import { BalmError } from '@balm-core/index';

const minifyOptions = {
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true
};

const esbuild = (
  input: string[],
  output: string,
  customOptions: any,
  callback: Function
): void => {
  const defaultOptions = {
    entryPoints: input.length
      ? BalmJS.file.absPaths(input)
      : [BalmJS.file.absPath(BalmJS.file.defaultEntry)],
    outdir: BalmJS.file.absPath(output),
    bundle: true,
    logLevel: 'silent'
  };

  const buildOptions = BalmJS.config.env.isProd
    ? Object.assign(defaultOptions, minifyOptions)
    : defaultOptions;

  const esbuildOptions = BalmJS.utils.isObject(BalmJS.config.scripts.esbuild)
    ? Object.assign(buildOptions, BalmJS.config.scripts.esbuild, customOptions)
    : Object.assign(buildOptions, customOptions);

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

export default esbuild;
