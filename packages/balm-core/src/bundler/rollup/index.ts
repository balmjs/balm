import getEntry from './entry';
import getOutput from './output';
import build from './build';
import { InputOptions, OutputOptions } from '@balm-core/index';

const buildLibrary = async (
  inputOptions: InputOptions,
  outputOptions: OutputOptions | OutputOptions[]
): Promise<void> => {
  const rollup = require('rollup');

  inputOptions = getEntry(inputOptions);
  outputOptions = getOutput(outputOptions);
  const rollupOptions = Object.assign({}, inputOptions, {
    output: outputOptions
  });

  const bundle = await rollup.rollup(rollupOptions);

  if (Array.isArray(outputOptions)) {
    for await (const outputOption of outputOptions) {
      await build(bundle, outputOption);
    }
  } else {
    await build(bundle, outputOptions);
  }
};

export default buildLibrary;
