import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getPostcssPlugins from '../../plugins/postcss';

let styleLoader = 'style-loader';

const getCssLoader = () => {
  let prodMode = config.isProd && config.scripts.extractCss.enabled;

  config.styles.postcssLoaderOptions.plugins = getPostcssPlugins();
  config.styles.postcssLoaderOptions.sourceMap = config.scripts.sourceMap;

  if (config.inSSR) {
    for (let i = 0, len = config.scripts.loaders.length; i < len; i++) {
      if (config.scripts.loaders[i].loader === 'vue-loader') {
        styleLoader = 'vue-style-loader';
        break;
      }
    }
  }

  return {
    test: /\.css$/,
    use: [
      prodMode ? MiniCssExtractPlugin.loader : styleLoader,
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

export default (config.scripts.cssLoader ? getCssLoader : false);
