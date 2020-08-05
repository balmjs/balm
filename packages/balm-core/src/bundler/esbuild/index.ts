import build from './build';
import transform from './transform';

const esbuild = (
  input: string | string[],
  output: string,
  customOptions: any,
  callback: Function
): void => {
  const entry = BalmJS.utils.isString(input)
    ? [input as string]
    : (input as string[]);

  BalmJS.config.scripts.useTransform
    ? transform(entry, output, customOptions, callback)
    : build(entry, output, customOptions, callback);
};

export default esbuild;
