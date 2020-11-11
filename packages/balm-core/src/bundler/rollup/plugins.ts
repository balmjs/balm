import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { InputOptions, OutputOptions, RollupPlugin } from '@balm-core/index';

function getInputPlugins(customInputOptions: InputOptions): RollupPlugin[] {
  const {
    inputOptions,
    nodeResolveOptions,
    commonjsOptions
  } = BalmJS.config.scripts;

  let inputPlugins = [
    nodeResolve(nodeResolveOptions),
    commonjs(commonjsOptions)
  ];

  if (inputOptions.plugins) {
    inputPlugins = inputPlugins.concat(inputOptions.plugins);
  }

  if (customInputOptions.plugins) {
    inputPlugins = inputPlugins.concat(customInputOptions.plugins);
  }

  return inputPlugins;
}

function getOutputPlugins(customOutputOptions: OutputOptions): RollupPlugin[] {
  let outputPlugins = BalmJS.config.env.isProd
    ? [terser(BalmJS.config.scripts.minifyOptions)]
    : [];

  if (customOutputOptions.plugins) {
    outputPlugins = outputPlugins.concat(customOutputOptions.plugins);
  }

  return outputPlugins;
}

export { getInputPlugins, getOutputPlugins };
