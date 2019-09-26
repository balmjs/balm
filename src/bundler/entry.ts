import { ObjectEntry } from '../config/types';

const FILENAME_REGEX: any = new RegExp('[^/]+$', 'i');
const HOT_CLIENT = 'webpack-hot-middleware/client';

function initVendors(entries: ObjectEntry): void {
  for (const key of Object.keys(entries)) {
    const value = entries[key] as string[];
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

  const HMR = Object.keys(BalmJS.config.server.hotOptions).length
    ? `${HOT_CLIENT}?` +
      Object.entries(BalmJS.config.server.hotOptions)
        .map(option => option.join('='))
        .join('&')
    : HOT_CLIENT;
  const useHMR: boolean =
    scripts.hot && BalmJS.config.env.isDev && !BalmJS.config.env.inSSR;

  if (BalmJS.utils.isObject(input)) {
    initVendors(input as ObjectEntry);

    for (const key of Object.keys(input)) {
      const value = (input as ObjectEntry)[key];
      const isVendor = BalmJS.utils.isArray(value);

      // Key
      const entryKey = isVendor
        ? path.join(scripts.vendorsName, key)
        : path.join(key);

      // Value
      const hotValue = BalmJS.utils.isString(value)
        ? [value as string, HMR]
        : [...(value as string[]), HMR];
      const entryValue = useHMR ? hotValue : value;

      // Result
      if (!isVendor) {
        webpackEntries[entryKey] = entryValue;
      }
    }
  } else if (BalmJS.utils.isArray(input) && input.length) {
    for (const value of input as string[]) {
      const matchResult = FILENAME_REGEX.exec(value)[0];
      const key = matchResult.split('.')[0];
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
