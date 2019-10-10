import { ObjectEntry } from '../config/types';

const FILENAME_REGEX = new RegExp('[^/]+$', 'i');
const HOT_CLIENT = 'webpack-hot-middleware/client';

function initVendors(entries: ObjectEntry): void {
  for (const key of Object.keys(entries)) {
    const value: string[] = entries[key] as string[];
    if (BalmJS.utils.isArray(value)) {
      BalmJS.vendors.push({
        key,
        value
      });
    }
  }
}

// Relative path
function getEntry(input: string | string[] | ObjectEntry, scripts: any): any {
  let webpackEntries: any = {};

  const HMR: string = Object.keys(BalmJS.config.server.hotOptions).length
    ? `${HOT_CLIENT}?` +
      Object.entries(BalmJS.config.server.hotOptions)
        .map(option => option.join('='))
        .join('&')
    : HOT_CLIENT;
  const useHMR: boolean =
    scripts.hot &&
    BalmJS.config.useDefaults &&
    BalmJS.config.env.isDev &&
    !BalmJS.config.env.inSSR;

  if (BalmJS.utils.isObject(input)) {
    initVendors(input as ObjectEntry);

    for (const key of Object.keys(input)) {
      const value: string | string[] = (input as ObjectEntry)[key];
      const isVendor: boolean = BalmJS.utils.isArray(value);

      // Key
      const entryKey: string = isVendor
        ? path.join(scripts.vendorsName, key)
        : path.join(key);

      // Value
      const hotValue: string[] = BalmJS.utils.isString(value)
        ? [value as string, HMR]
        : [...(value as string[]), HMR];
      const entryValue: string | string[] = useHMR ? hotValue : value;

      // Result
      if (!isVendor) {
        webpackEntries[entryKey] = entryValue;
      }
    }
  } else if (BalmJS.utils.isArray(input) && input.length) {
    for (const value of input as string[]) {
      const matchResult: string = (FILENAME_REGEX as any).exec(value)[0];
      const key: string = matchResult.split('.')[0];
      webpackEntries[key] = useHMR ? [value, HMR] : value;
    }
  } else if (BalmJS.utils.isString(input)) {
    webpackEntries = useHMR ? [input, HMR] : input;
  } else {
    BalmJS.logger.warn(
      'webpack entry',
      'scripts entry must be a `string | array | object`'
    );
  }

  BalmJS.logger.debug('webpack entry', webpackEntries, {
    pre: true
  });

  return webpackEntries;
}

export default getEntry;
