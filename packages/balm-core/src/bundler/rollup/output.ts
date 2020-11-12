import { getOutputPlugins } from './plugins';
import { OutputOptions, OutputPlugin } from '@balm-core/index';

function setOutputPath(
  type: 'dir' | 'file',
  outputOptions: OutputOptions
): string {
  return BalmJS.file.absPath(outputOptions[type] || BalmJS.config.dest.js);
}

function setOutput(outputOptions: OutputOptions): OutputOptions {
  const outputPlugins = getOutputPlugins(outputOptions);

  outputOptions = Object.assign(
    {},
    BalmJS.config.scripts.outputOptions,
    outputOptions
  );

  outputOptions.plugins = outputPlugins as OutputPlugin[];

  if (outputOptions.dir) {
    outputOptions.dir = setOutputPath('dir', outputOptions);
  } else {
    outputOptions.file = setOutputPath('file', outputOptions);
  }

  return outputOptions;
}

function getOutput(
  outputOptions: OutputOptions | OutputOptions[]
): OutputOptions | OutputOptions[] {
  return Array.isArray(outputOptions)
    ? outputOptions.map((outputOption) => setOutput(outputOption))
    : setOutput(outputOptions);
}

export default getOutput;
