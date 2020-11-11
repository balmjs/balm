import { rollup, watch } from 'rollup';
import build from './build';
import { getInputPlugins } from './plugins';
import {
  InputOptions,
  OutputOptions,
  RollupOptions,
  RollupWatchOptions
} from '@balm-core/index';

const buildLibrary = async (
  inputOptions: InputOptions,
  outputOptions: OutputOptions | OutputOptions[],
  callback: Function
): Promise<any> => {
  const inputPlugins = getInputPlugins(inputOptions);

  const options = Object.assign(
    BalmJS.config.scripts.inputOptions,
    inputOptions
  );
  options.plugins = inputPlugins;

  const bundle = await rollup(options as RollupOptions);

  const watcher = watch([
    Object.assign(
      options,
      BalmJS.config.scripts.watchOptions
    ) as RollupWatchOptions
  ]);
  watcher.on('event', (event) => {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    if (event.code === 'ERROR') {
      BalmJS.logger.error('rollup', event.error);
    }
  });

  if (Array.isArray(BalmJS.config.scripts.outputOptions)) {
    for await (const outputOption of Object.assign(
      BalmJS.config.scripts.outputOptions,
      outputOptions as OutputOptions[]
    )) {
      build(bundle, outputOption);
    }
  } else {
    await build(
      bundle,
      Object.assign(
        BalmJS.config.scripts.outputOptions,
        outputOptions as OutputOptions
      )
    );
  }

  watcher.close();
  callback();
};

export default buildLibrary;
