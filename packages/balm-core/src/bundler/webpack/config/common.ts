import HtmlWebpackPlugin from 'html-webpack-plugin';
import getLoaders from '../loaders.js';
import { CHUNK } from '../../../config/constants.js';
import getClientEnvironment from './env.js';
import { LooseObject, Configuration, BalmScripts } from '@balm-core/index';

function getDefaultPlugins(
  webpack: LooseObject,
  scripts: BalmScripts
): object[] {
  // We will provide `BalmJS.file.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(BalmJS.file.publicUrlOrPath.slice(0, -1));

  const plugins: object[] = [
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise webapp will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
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

function getSplitChunks(): object | boolean {
  const scripts: BalmScripts = BalmJS.config.scripts;
  const jsFolder: string = BalmJS.config.paths.target.js;

  let cacheGroups: { [key: string]: object } = {};

  if (scripts.extractAllVendors) {
    // All vendors
    const vendorsFilename = scripts.useCache
      ? `${scripts.vendorName}.${CHUNK.hash}.js`
      : `${scripts.vendorName}.js`;

    cacheGroups = {
      allVendors: {
        name: 'vendors',
        chunks: 'all',
        test: /[\\/](node_modules|bower_components)[\\/]/,
        filename: BalmJS.file.assetsPath(`${jsFolder}/${vendorsFilename}`) // Output: `js/vendors.js`
      }
    };
  } else if (BalmJS.vendors.length) {
    // Custom vendors
    cacheGroups = {};
    for (const vendor of BalmJS.vendors) {
      const name = vendor.key;
      const cacheGroupModules = vendor.value.join('|');
      const vendorFilename = scripts.useCache
        ? `${name}.${CHUNK.hash}.js`
        : `${name}.js`;

      cacheGroups[`${name}Scripts`] = {
        name,
        chunks: 'initial',
        test: new RegExp(`[\\\\/](${cacheGroupModules})[\\\\/].*(?<!\\.css)$`),
        filename: BalmJS.file.assetsPath(
          `${jsFolder}/${scripts.vendorName}/${vendorFilename}`
        ), // Output: `js/vendor/customVendorName.js`
        enforce: true
      };
    }
  }

  if (BalmJS.config.env.isProd && BalmJS.config.scripts.extractCss) {
    // Custom styles in scripts
    for (const entry of BalmJS.entries) {
      const name = entry.key;

      cacheGroups[`${name}Styles`] = {
        type: 'css/mini-extract',
        name,
        chunks: (chunk: { name: string }) => chunk.name === name,
        enforce: true
      };
    }
  }

  return Object.keys(cacheGroups).length ? { cacheGroups } : false;
}

function getCommonConfig(
  webpack: LooseObject,
  scripts: BalmScripts
): Configuration {
  const splitChunks = getSplitChunks();
  const optimization = (splitChunks as boolean)
    ? BalmJS.utils.deepMerge(
        {
          splitChunks: splitChunks as object
        },
        scripts.optimization
      )
    : scripts.optimization;

  return {
    context: BalmJS.config.workspace,
    mode: 'none',
    // Stop compilation early in production
    bail: BalmJS.config.env.isProd,
    module: {
      strictExportPresence: true,
      rules: getLoaders(scripts.loaders)
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
      mainFields: ['browser', 'module', 'main']
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
