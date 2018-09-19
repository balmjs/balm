import { isString, isObject, isArray } from '../utilities';

const FILENAME_REGEX = new RegExp('[^/]+$', 'i');
const HOT_RELOAD = 'webpack-hot-middleware/client';

// Relative path
const getEntry = (input, { entry, vendors, vendorName, hot }) => {
  let webpackEntries = {};

  if (input) {
    if (isArray(input) && input.length) {
      for (let value of input) {
        let matchResult = FILENAME_REGEX.exec(value)[0];
        let key = matchResult.split('.')[0];
        webpackEntries[key] = value;
      }
    } else {
      webpackEntries = input;
    }
  } else if (isObject(entry)) {
    for (let key of Object.keys(entry)) {
      let value = entry[key];
      let isVendor = vendors.map(vendor => vendor.key).includes(key);

      // Key
      let entryKey = isVendor ? path.join(vendorName, key) : path.join(key);

      // Value
      let hotValue = isString(value)
        ? [value, HOT_RELOAD]
        : [...value, HOT_RELOAD];
      let entryValue =
        !config.production && hot && !config.ssr ? hotValue : value;

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
