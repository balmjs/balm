import build from './build';
import transform from './transform';
import { BuildOptions, TransformOptions } from '@balm-core/index';

const esbuild = (
  input: string | string[],
  output: string,
  customOptions: BuildOptions | TransformOptions,
  callback: Function
): void => {
  const entryPoints = BalmJS.utils.isString(input)
    ? [input as string]
    : (input as string[]);

  BalmJS.config.scripts.useTransform
    ? transform(
        entryPoints,
        output,
        customOptions as TransformOptions,
        callback
      )
    : build(entryPoints, output, customOptions as BuildOptions, callback);
};

export default esbuild;
