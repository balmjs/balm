import getLoaders from '../loaders';
import { INJECT_HASHNAME } from '../../config/constants';

function _getSplitChunks(): boolean | object {
  const scripts = BalmJS.config.scripts;
  const jsFolder = BalmJS.config.paths.target.js;

  let cacheGroups: any = false;
  if (BalmJS.vendors.length) {
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
        test: new RegExp(`[\\\\/]${cacheGroupModules}[\\\\/]`),
        filename: BalmJS.file.assetsPath(
          path.join(jsFolder, scripts.vendorsName, jsFilename)
        ), // Output: `js/vendors/customVendor.js`
        enforce: true
      };
    }
  } else if (scripts.splitAllVendors) {
    // All vendors
    const jsFilename = scripts.inject
      ? `${scripts.vendorsName}.${INJECT_HASHNAME}.js`
      : `${scripts.vendorsName}.js`;

    cacheGroups = {
      vendors: {
        chunks: 'initial',
        name: jsFilename,
        test: /[\\/]node_modules|bower_components[\\/]/,
        filename: BalmJS.file.assetsPath(`${jsFolder}/${jsFilename}`) // Output: `js/vendors.js`
      }
    };
  }

  return cacheGroups ? { cacheGroups } : false;
}

function getCommonConfig(scripts: any): any {
  const splitChunks = _getSplitChunks();
  const optimization = splitChunks
    ? BalmJS.utils.mergeDeep(
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
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...scripts.plugins
    ],
    target: scripts.target,
    stats: scripts.stats
  };
}

export default getCommonConfig;
