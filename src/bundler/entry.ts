const FILENAME_REGEX: any = new RegExp('[^/]+$', 'i');
const HOT_CLIENT = 'webpack-hot-middleware/client';

// Relative path
function getEntry(
  scripts: any,
  input?: string | string[] | { [entryChunkName: string]: string | string[] }
): any {
  let webpackEntries: any = {};

  const HMR = Object.keys(BalmJS.config.server.hotOptions).length
    ? `${HOT_CLIENT}?` +
      Object.entries(BalmJS.config.server.hotOptions)
        .map(option => option.join('='))
        .join('&')
    : HOT_CLIENT;

  if (input) {
    if (BalmJS.utils.isArray(input) && input.length) {
      for (const value of input as string[]) {
        const matchResult = FILENAME_REGEX.exec(value)[0];
        const key = matchResult.split('.')[0];
        webpackEntries[key] = value;
      }
    } else if (BalmJS.utils.isString(input)) {
      webpackEntries = input as string;
    } else {
      // BalmJS.logger.warn('<webpack entry>', 'JS entry must be an object');
    }
  } else if (BalmJS.utils.isObject(scripts.entry)) {
    for (const key of Object.keys(scripts.entry)) {
      const value = scripts.entry[key];
      const isVendor = scripts.vendors
        .map((vendor: any) => vendor.key)
        .includes(key);

      // Key
      const entryKey = isVendor
        ? path.join(scripts.vendorName, key)
        : path.join(key);

      // Value
      const hotValue = BalmJS.utils.isString(value)
        ? [value, HMR]
        : [...value, HMR];
      const entryValue =
        scripts.hot && BalmJS.config.env.isDev && !BalmJS.config.env.inSSR
          ? hotValue
          : value;

      // Result
      if (!isVendor) {
        webpackEntries[entryKey] = entryValue;
      }
    }
  }

  if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
    BalmJS.logger.info('<webpack entry>', webpackEntries);
  }

  return webpackEntries;
}

export default getEntry;
