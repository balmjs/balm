import { rollup } from 'rollup';
import getEntry from './entry.js';
import getOutput from './output.js';
import build from './build.js';
import { InputOptions, OutputOptions } from '@balm-core/index';

const buildLibrary = async (
  inputOptions: InputOptions,
  outputOptions: OutputOptions | OutputOptions[]
): Promise<void> => {
  inputOptions = getEntry(inputOptions);
  outputOptions = getOutput(outputOptions);
  const rollupOptions = Object.assign({}, inputOptions, {
    output: outputOptions
  });

  const bundle = await rollup(rollupOptions);

  if (Array.isArray(outputOptions)) {
    for await (const outputOption of outputOptions) {
      await build(bundle, outputOption);
    }
  } else {
    await build(bundle, outputOptions);
  }
};

export default buildLibrary;
