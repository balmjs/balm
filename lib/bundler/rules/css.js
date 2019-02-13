import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getPostcssPlugins from '../../plugins/postcss';

const getCssLoader = () => {
  let prodMode = config.isProd && config.scripts.extractCss.enabled;

  config.styles.postcssLoaderOptions.plugins = getPostcssPlugins();
  config.styles.postcssLoaderOptions.sourceMap = config.scripts.sourceMap;

  return {
    test: /\.css$/,
    use: [
      prodMode ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
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

export default (config.scripts.cssLoader && !config.inSSR
  ? getCssLoader
  : false);
