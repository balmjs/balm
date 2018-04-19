import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getPostcssPlugins from '../../plugins/postcss';

config.styles.postcssLoaderOptions.plugins = getPostcssPlugins();

const CSS_LOADER =
  config.production && config.scripts.extractCss.enabled
    ? {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
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
