import { mergeDeep } from '../utilities';
import getLoaders from './loaders';

const getCommonConfig = options => {
  let vendors = options.vendors;

  let cacheGroups = false;
  if (options.extractAllVendors) {
    cacheGroups = {
      vendors: {
        test: /[\\/]node_modules|bower_components[\\/]/,
        chunks: 'initial',
        name: `${options.vendorName}.js`,
        filename: BalmFile.assetsPath(
          `${config.paths.target.js}/${options.vendorName}.js`
        )
      }
    };
  } else if (vendors.length) {
    cacheGroups = {};
    vendors.forEach(vendor => {
      let name = vendor.key;
      let reg = vendor.value.join('|');
      cacheGroups[name] = {
        test: new RegExp(`[\\\\/]${reg}[\\\\/]`),
        chunks: 'initial',
        name: `${name}.js`,
        filename: BalmFile.assetsPath(
          path.join(config.paths.target.js, options.vendorName, `${name}.js`)
        )
      };
    });
  }

  let optimization = mergeDeep(
    {
      occurrenceOrder: true,
      splitChunks: cacheGroups ? { cacheGroups } : false
    },
    options.optimization
  );

  return {
    context: config.workspace,
    module: {
      rules: getLoaders(options.loaders),
      strictExportPresence: true
    },
    resolve: {
      // (was split into `root`, `modulesDirectories` and `fallback` in the old options)
      // In which folders the resolver look for modules
      // relative paths are looked up in every parent folder (like node_modules)
      // absolute paths are looked up directly
      // the order is respected
      modules: ['node_modules', 'bower_components', config.source.base],
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
        ...options.extensions
      ],
      // These aliasing is used when trying to resolve a module
      alias: options.alias,
      // These JSON files are read in directories
      descriptionFiles: ['package.json', 'bower.json'],
      // These fields in the description files are looked up when trying to resolve the package directory
      mainFields: ['main', 'browser', 'module']
    },
    plugins: [
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how Webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...options.plugins
    ],
    stats: options.stats,
    optimization
  };
};

export default getCommonConfig;
