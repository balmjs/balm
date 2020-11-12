import { getOutputPlugins } from './plugins';
import { OutputOptions, OutputPlugin } from '@balm-core/index';

function setOutput(outputOptions: OutputOptions): OutputOptions {
  const outputPlugins = getOutputPlugins(outputOptions);

  outputOptions = Object.assign(
    {},
    BalmJS.config.scripts.outputOptions,
    outputOptions
  );

  outputOptions.plugins = outputPlugins as OutputPlugin[];

  if (outputOptions.dir) {
    outputOptions.dir = BalmJS.file.absPath(outputOptions.dir);
  } else {
    outputOptions.file = BalmJS.file.absPath(outputOptions.file as string);
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
