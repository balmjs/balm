import ExtractTextPlugin from 'extract-text-webpack-plugin';
import postcssPlugins from '../plugins/postcss';

config.styles.postcssLoaderOptions.plugins = postcssPlugins;

let extractTextOptions = {
  use: config.scripts.extractCss.use,
  fallback: config.scripts.extractCss.fallback
};

if (config.scripts.extractCss.publicPath) {
  extractTextOptions.publicPath = config.scripts.extractCss.publicPath;
}

const CSS_LOADER =
  config.production && config.scripts.extractCss.enabled
    ? {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(extractTextOptions)
      }
    : {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: config.production,
              sourceMap: config.scripts.sourceMap
            }
          },
          {
            loader: 'postcss-loader',
            options: config.styles.postcssLoaderOptions
          }
        ]
      };

export default (config.scripts.cssLoader ? CSS_LOADER : false);
