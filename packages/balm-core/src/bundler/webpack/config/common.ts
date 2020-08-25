import getLoaders from '../loaders';
import { INJECT_HASHNAME } from '../../../config/constants';
import { Configuration } from '@balm-core/index';

function getSplitChunks(): boolean | object {
  const scripts: any = BalmJS.config.scripts;
  const jsFolder: string = BalmJS.config.paths.target.js;

  let cacheGroups: any = false;
  if (scripts.extractAllVendors) {
    // All vendors
    const jsFilename = scripts.inject
      ? `${scripts.vendorName}.${INJECT_HASHNAME}.js`
      : `${scripts.vendorName}.js`;

    cacheGroups = {
      // NOTE: `defaultVendors` for webpack@5
      vendors: {
        chunks: 'initial',
        name: jsFilename,
        test: /[\\/](node_modules|bower_components)[\\/]/,
        filename: BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`) // Output: `js/vendors.js`
      }
    };
  } else if (BalmJS.vendors.length) {
    // Custom vendors
    cacheGroups = {};
    for (const vendor of BalmJS.vendors) {
      const cacheGroupKey = vendor.key;
      const cacheGroupModules = vendor.value.join('|');
      const jsFilename = scripts.inject
        ? `${cacheGroupKey}.${INJECT_HASHNAME}.js`
        : `${cacheGroupKey}.js`;

      cacheGroups[cacheGroupKey] = {
        chunks: 'initial',
        name: jsFilename,
        test: new RegExp(`[\\\\/](${cacheGroupModules})[\\\\/]`),
        filename: BalmJS.file.assetsPath(
          path.join(jsFolder, scripts.vendorName, jsFilename)
        ), // Output: `js/vendor/customVendorName.js`
        enforce: true
      };
    }
  }

  return cacheGroups ? { cacheGroups } : false;
}

function getCommonConfig(scripts: any): Configuration {
  const splitChunks: any = getSplitChunks();
  const optimization: any = splitChunks
    ? BalmJS.utils.deepMerge(
        {
          splitChunks
        },
        scripts.optimization
      )
    : scripts.optimization;

  return {
    context: BalmJS.config.workspace,
    mode: 'none',
    module: {
      rules: getLoaders(scripts.loaders),
      strictExportPresence: true
    },
    resolve: {
      // (was split into `root`, `modulesDirectories` and `fallback` in the old options)
      // In which folders the resolver look for modules
      // relative paths are looked up in every parent folder (like node_modules)
      // absolute paths are looked up directly
      // the order is respected
      modules: [
        'node_modules',
        'bower_components',
        BalmJS.file.absPath(BalmJS.config.src.base)
      ],
      // These extensions are tried when resolving a file
      extensions: [
        '.wasm',
        '.mjs',
        '.js',
        '.json',
        '.jsx',
        '.ts',
        '.tsx',
        '.vue',
        ...scripts.extensions
      ],
      // These aliasing is used when trying to resolve a module
      alias: scripts.alias,
      // These JSON files are read in directories
      descriptionFiles: ['package.json', 'bower.json'],
      // These fields in the description files are looked up when trying to resolve the package directory
      mainFields: ['main', 'browser', 'module']
    },
    optimization,
    plugins: [
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // NOTE: for webpack@5
      // new webpack.IgnorePlugin({
      //   resourceRegExp: /^\.\/locale$/,
      //   contextRegExp: /moment$/
      // }),
      ...scripts.plugins
    ],
    target: scripts.target,
    stats: scripts.stats
  };
}

export default getCommonConfig;
