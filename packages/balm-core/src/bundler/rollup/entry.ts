import { getInputPlugins } from './plugins.js';
import { InputOption, InputOptions } from '@balm-core/index';

function getEntry(inputOptions: InputOptions): InputOptions {
  // Set plugins
  const inputPlugins = getInputPlugins(inputOptions);

  const options = Object.assign(
    {},
    BalmJS.config.scripts.inputOptions,
    inputOptions
  );

  options.plugins = inputPlugins;

  // Set entry points
  const { input } = options;
  let rollupEntries = input as InputOption;

  if (BalmJS.utils.isObject(input)) {
    const entries = input as { [entryAlias: string]: string };

    Object.keys(entries).forEach((entryAlias) => {
      entries[entryAlias] = BalmJS.file.absPath(entries[entryAlias]);
    });

    rollupEntries = entries;
  } else {
    rollupEntries = BalmJS.file.absPaths(input as string | string[]);
  }

  options.input = rollupEntries;

  BalmJS.logger.debug('rollup input options', options, {
    pre: true
  });

  return options;
}

export default getEntry;
