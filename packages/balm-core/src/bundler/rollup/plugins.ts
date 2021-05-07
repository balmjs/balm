import { InputOptions, OutputOptions, RollupPlugin } from '@balm-core/index';

function getInputPlugins(customInputOptions: InputOptions): RollupPlugin[] {
  const { inputOptions } = BalmJS.config.scripts;

  const inputPlugins: RollupPlugin[] = [];

  if (inputOptions.plugins) {
    inputPlugins.push(...inputOptions.plugins);
  }

  if (customInputOptions.plugins) {
    inputPlugins.push(...customInputOptions.plugins);
  }

  return inputPlugins;
}

function getOutputPlugins(customOutputOptions: OutputOptions): RollupPlugin[] {
  const { outputOptions } = BalmJS.config.scripts;

  const outputPlugins: RollupPlugin[] = [];

  if (outputOptions.plugins) {
    outputPlugins.push(...outputOptions.plugins);
  }

  if (BalmJS.config.env.isProd) {
    outputPlugins.push(
      requireModule('rollup-plugin-terser').terser(
        BalmJS.config.scripts.minifyOptions
      )
    );
  }

  if (customOutputOptions.plugins) {
    outputPlugins.push(...customOutputOptions.plugins);
  }

  return outputPlugins;
}

export { getInputPlugins, getOutputPlugins };
