import build from './build';
import transform from './transform';

const esbuild = (
  input: string[],
  output: string,
  customOptions: any,
  callback: Function
): void => {
  BalmJS.config.scripts.useTransform
    ? transform(input, output, customOptions, callback)
    : build(input, output, customOptions, callback);
};

export default esbuild;
