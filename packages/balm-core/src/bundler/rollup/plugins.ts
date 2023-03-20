import terser from '@rollup/plugin-terser';
import { InputOptions, OutputOptions, RollupPlugin } from '@balm-core/index';

function getInputPlugins(customInputOptions: InputOptions): RollupPlugin[] {
  const { inputOptions } = BalmJS.config.scripts;

  const inputPlugins: RollupPlugin[] = [];

  if (inputOptions.plugins) {
    inputPlugins.push(...(inputOptions.plugins as RollupPlugin[]));
  }

  if (customInputOptions.plugins) {
    inputPlugins.push(...(customInputOptions.plugins as RollupPlugin[]));
  }

  return inputPlugins;
}

function getOutputPlugins(customOutputOptions: OutputOptions): RollupPlugin[] {
  const { outputOptions } = BalmJS.config.scripts;

  const outputPlugins: RollupPlugin[] = [];

  if (outputOptions.plugins) {
    outputPlugins.push(...(outputOptions.plugins as RollupPlugin[]));
  }

  if (BalmJS.config.env.isProd) {
    outputPlugins.push(terser(BalmJS.config.scripts.minifyOptions));
  }

  if (customOutputOptions.plugins) {
    outputPlugins.push(...(customOutputOptions.plugins as RollupPlugin[]));
  }

  return outputPlugins;
}

export { getInputPlugins, getOutputPlugins };
