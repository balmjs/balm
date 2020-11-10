import { rollup, watch } from 'rollup';
import build from './build';
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
  const bundle = await rollup(
    Object.assign(
      BalmJS.config.scripts.inputOptions,
      inputOptions
    ) as RollupOptions
  );

  const watcher = watch([
    Object.assign(
      BalmJS.config.scripts.inputOptions,
      inputOptions,
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
