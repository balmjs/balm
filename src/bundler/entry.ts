const FILENAME_REGEX: any = new RegExp('[^/]+$', 'i');
const HOT_CLIENT = 'webpack-hot-middleware/client';

function initVendors(entries: {
  [entryChunkName: string]: string | string[];
}): void {
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
function getEntry(
  input: string | string[] | { [entryChunkName: string]: string | string[] },
  scripts: any
): any {
  let webpackEntries: any = {};

  const HMR = Object.keys(BalmJS.config.server.hotOptions).length
    ? `${HOT_CLIENT}?` +
      Object.entries(BalmJS.config.server.hotOptions)
        .map(option => option.join('='))
        .join('&')
    : HOT_CLIENT;

  if (BalmJS.utils.isObject(input)) {
    initVendors(input as {
      [entryChunkName: string]: string | string[];
    });

    for (const key of Object.keys(input)) {
      const value = (input as any)[key];
      const isVendor = BalmJS.utils.isArray(value);

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
  } else if (BalmJS.utils.isArray(input) && input.length) {
    for (const value of input as string[]) {
      const matchResult = FILENAME_REGEX.exec(value)[0];
      const key = matchResult.split('.')[0];
      webpackEntries[key] = value;
    }
  } else if (BalmJS.utils.isString(input)) {
    webpackEntries = input as string;
  } else {
    BalmJS.logger.warn(
      '<webpack entry>',
      'scripts entry must be a `string | array | object`'
    );
  }

  if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
    BalmJS.logger.info('<webpack entry>', webpackEntries);
  }

  return webpackEntries;
}

export default getEntry;
