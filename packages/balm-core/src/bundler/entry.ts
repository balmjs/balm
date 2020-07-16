import { HMR_PATH } from '../config/constants';
import { BalmEntryObject, BalmVendor } from '@balm-core/index';

const FILENAME_REGEX = new RegExp('[^/]+$', 'i');
const HOT_CLIENT = 'webpack-hot-middleware/client';

function initVendors(entries: BalmEntryObject): void {
  const vendors: BalmVendor[] = [];

  for (const [key, value] of Object.entries(entries)) {
    if (BalmJS.utils.isArray(value)) {
      vendors.push({
        key,
        value: value as string[]
      });
    }
  }

  // if (vendors.length) {
  //   const vendorKeys: string[] = Array.from(
  //     new Set(vendors.map(vendor => vendor.key))
  //   );

  //   if (vendorKeys.length === vendors.length) {
  //     BalmJS.vendors = vendors;
  //   } else {
  //     BalmJS.logger.warn('webpack entry', 'conflicting vendors key');
  //   }
  // }

  BalmJS.vendors = vendors.length ? vendors : [];
}

// Relative path
function getEntry(
  input: string | string[] | BalmEntryObject,
  scripts: any
): any {
  let webpackEntries: any = {};

  const hotOptions: object = Object.assign(
    {},
    BalmJS.config.server.hotOptions,
    {
      path: HMR_PATH
    }
  );
  const HMR: string =
    `${HOT_CLIENT}?` +
    Object.entries(hotOptions)
      .map((option) => option.join('='))
      .join('&');
  const useHMR = BalmJS.config.server.useHMR;

  if (BalmJS.utils.isObject(input)) {
    initVendors(input as BalmEntryObject);

    for (const [key, value] of Object.entries(input as BalmEntryObject)) {
      const isVendor: boolean = BalmJS.utils.isArray(value);

      // Key
      const entryKey: string = isVendor
        ? path.join(scripts.vendorName, key)
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
  } else if (BalmJS.utils.isArray(input) && (input as string[]).length) {
    for (const value of input as string[]) {
      const matchResult: string = (FILENAME_REGEX as any).exec(value)[0];
      const key: string = matchResult.split('.')[0];
      webpackEntries[key] = useHMR ? [value, HMR] : value;
    }
  } else if (BalmJS.utils.isString(input) && (input as string).trim().length) {
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
