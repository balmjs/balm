import getLoaders from '../loaders';
import { INJECT_HASHNAME } from '../../config/constants';

function getCommonConfig(scripts: any): any {
  const vendorsCount = BalmJS.vendors.length;

  let cacheGroups: any = false;
  if (scripts.extractAllVendors) {
    const filename = scripts.inject
      ? `${scripts.vendorName}.${INJECT_HASHNAME}.js`
      : `${scripts.vendorName}.js`;

    cacheGroups = {
      vendors: {
        test: /[\\/]node_modules|bower_components[\\/]/,
        chunks: 'initial',
        name: filename,
        filename: BalmJS.file.assetsPath(
          `${BalmJS.config.paths.target.js}/${filename}`
        )
      }
    };
  } else if (vendorsCount) {
    cacheGroups = {};
    for (let i = 0; i < vendorsCount; i++) {
      const vendor = BalmJS.vendors[i];
      const name = vendor.key;
      const reg = vendor.value.join('|');
      const filename = scripts.inject
        ? `${name}.${INJECT_HASHNAME}.js`
        : `${name}.js`;

      cacheGroups[name] = {
        test: new RegExp(`[\\\\/]${reg}[\\\\/]`),
        chunks: 'initial',
        name: filename,
        filename: BalmJS.file.assetsPath(
          path.join(BalmJS.config.paths.target.js, scripts.vendorName, filename)
        )
      };
    }
  }

  const optimization = cacheGroups
    ? BalmJS.utils.mergeDeep(
        {
          splitChunks: { cacheGroups }
        },
        scripts.optimization
      )
    : scripts.optimization;

  return {
    context: BalmJS.config.workspace,
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
        BalmJS.file.absPaths(BalmJS.config.src.base)
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
