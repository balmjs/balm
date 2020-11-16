import { rollup, watch } from 'rollup';
import getEntry from './entry';
import getOutput from './output';
import build from './build';
import { InputOptions, OutputOptions } from '@balm-core/index';

const buildLibrary = async (
  inputOptions: InputOptions,
  outputOptions: OutputOptions | OutputOptions[],
  callback: Function
): Promise<any> => {
  inputOptions = getEntry(inputOptions);
  outputOptions = getOutput(outputOptions);
  const rollupOptions = Object.assign({}, inputOptions, {
    output: outputOptions
  });

  const bundle = await rollup(rollupOptions);

  const watcher = watch(
    Object.assign({}, rollupOptions, BalmJS.config.scripts.watchOptions)
  );
  watcher.on('event', (event) => {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    switch (event.code) {
      case 'END':
        callback();
        break;
      case 'ERROR':
        BalmJS.logger.error('rollup', event.error.message);
        break;
    }
  });

  if (Array.isArray(outputOptions)) {
    for await (const outputOption of outputOptions) {
      await build(bundle, outputOption);
    }
  } else {
    await build(bundle, outputOptions);
  }

  watcher.close();
};

export default buildLibrary;
