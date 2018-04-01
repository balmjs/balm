import { isString, isArray } from '../utilities';

const FILENAME_REGEX = new RegExp('[^/]+$', 'i');
const HOT_RELOAD = 'webpack-hot-middleware/client';

// Relative path
const getEntry = input => {
  let webpackEntries = input || {};

  if (input) {
    if (isArray(input) && input.length) {
      webpackEntries = {};

      for (let value of input) {
        let matchResult = FILENAME_REGEX.exec(value)[0];
        let key = matchResult.split('.')[0];
        webpackEntries[key] = value;
      }
    }
  } else {
    for (let key of Object.keys(config.scripts.entry)) {
      let value = config.scripts.entry[key];
      let isVendor = config.scripts.vendors
        .map(vendor => vendor.key)
        .includes(key);
      // Key
      let entryKey = isVendor
        ? path.join(config.scripts.vendorName, key)
        : path.join(key);
      // Value
      let hotValue = isString(value)
        ? [value, HOT_RELOAD]
        : [...value, HOT_RELOAD];
      let entryValue =
        !config.production && config.scripts.hot ? hotValue : value;
      // Result
      if (!isVendor) {
        webpackEntries[entryKey] = entryValue;
      }
    }
  }

  logger.info('[JS entry]', webpackEntries);

  return webpackEntries;
};

export default getEntry;
