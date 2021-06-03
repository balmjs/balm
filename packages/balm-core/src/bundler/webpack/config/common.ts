import HtmlWebpackPlugin from 'html-webpack-plugin';
import getLoaders from '../loaders.js';
import { HASH_NAME_PROD } from '../../../config/constants.js';
import { Configuration, BalmScripts } from '@balm-core/index';

function getDefaultPlugins(webpack: any, scripts: BalmScripts): object[] {
  const plugins: object[] = [
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ];

  if (scripts.injectHtml) {
    const isSPA = BalmJS.entries.length < 2;
    const titles: string | string[] = (
      scripts.htmlPluginOptions as {
        title?: string | string[];
      }
    ).title || ['BalmJS App'];

    if (!BalmJS.entries.length) {
      BalmJS.entries.push({
        key: 'main',
        value: `./${BalmJS.file.defaultEntry}`
      });
    }

    BalmJS.entries.forEach((entry, index) => {
      const entryName = isSPA ? 'index' : entry.key;
      const chunks = isSPA ? '?' : [entryName];
      const title = titles[index];

      const options = Object.assign(
        {
          filename: BalmJS.file.absPath(
            `${BalmJS.config.src.base}/${entryName}.html`
          ),
          chunks
        },
        scripts.htmlPluginOptions,
        {
          title
        }
      );

      plugins.push(new HtmlWebpackPlugin(options));
    });
  }

  return plugins;
}

function getSplitChunks(): any {
  const scripts: BalmScripts = BalmJS.config.scripts;
  const jsFolder: string = BalmJS.config.paths.target.js;

  let cacheGroups: { [key: string]: object } = {};

  if (scripts.extractAllVendors) {
    // All vendors
    const jsFilename = BalmJS.useCache
      ? `${scripts.vendorName}.${HASH_NAME_PROD}.js`
      : `${scripts.vendorName}.js`;

    cacheGroups = {
      defaultVendors: {
        name: 'vendors',
        chunks: 'all',
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
      const jsFilename = BalmJS.useCache
        ? `${cacheGroupKey}.${HASH_NAME_PROD}.js`
        : `${cacheGroupKey}.js`;

      cacheGroups[cacheGroupKey] = {
        name: cacheGroupKey,
        chunks: 'initial',
        test: new RegExp(`[\\\\/](${cacheGroupModules})[\\\\/].*(?<!\\.css)$`),
        filename: BalmJS.file.assetsPath(
          `${jsFolder}/${scripts.vendorName}/${jsFilename}`
        ), // Output: `js/vendor/customVendorName.js`
        enforce: true
      };
    }
  }

  if (BalmJS.config.env.isProd && BalmJS.config.scripts.extractCss) {
    // Custom styles in scripts
    cacheGroups.css = {
      name: 'css',
      chunks: 'all',
      test: /\.css$/,
      enforce: true
    };
  }

  return Object.keys(cacheGroups).length ? { cacheGroups } : false;
}

function getCommonConfig(webpack: any, scripts: BalmScripts): Configuration {
  const splitChunks = getSplitChunks();
  const optimization = splitChunks
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
      alias: scripts.alias as any,
      // These JSON files are read in directories
      descriptionFiles: ['package.json', 'bower.json'],
      // These fields in the description files are looked up when trying to resolve the package directory
      mainFields: ['main', 'browser', 'module']
    },
    optimization,
    plugins: [
      ...getDefaultPlugins(webpack, scripts),
      ...scripts.plugins
    ] as any[],
    target: scripts.target,
    stats: scripts.stats as object
  };
}

export default getCommonConfig;
