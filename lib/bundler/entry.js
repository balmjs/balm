import { isString, isArray } from '../utilities';

const FILENAME_REGEX = new RegExp('[^/]+$', 'i');
const HOT_RELOAD = 'webpack-hot-middleware/client';

// Relative path
const getEntry = (input, options) => {
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
    for (let key of Object.keys(options.entry)) {
      let value = options.entry[key];
      let isVendor = options.vendors.map(vendor => vendor.key).includes(key);
      // Key
      let entryKey = isVendor
        ? path.join(options.vendorName, key)
        : path.join(key);
      // Value
      let hotValue = isString(value)
        ? [value, HOT_RELOAD]
        : [...value, HOT_RELOAD];
      let entryValue = !config.production && options.hot ? hotValue : value;
      // Result
      if (!isVendor) {
        webpackEntries[entryKey] = entryValue;
      }
    }
  }

  return webpackEntries;
};

export default getEntry;
