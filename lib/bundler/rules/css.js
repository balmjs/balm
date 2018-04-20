import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getPostcssPlugins from '../../plugins/postcss';

const getCssLoader = () => {
  config.styles.postcssLoaderOptions.plugins = getPostcssPlugins();
  config.styles.postcssLoaderOptions.sourceMap = config.scripts.sourceMap;

  return config.production && config.scripts.extractCss.enabled
    ? {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    : // TODO: Unsupported `vue-style-loader@v15`
      {
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
};

export default (config.scripts.cssLoader ? getCssLoader : false);
