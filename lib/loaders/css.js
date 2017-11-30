import postcssPlugins from '../plugins/postcss';

config.styles.postcss.loaderOptions.plugins = postcssPlugins;

const CSS_LOADER = {
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
      options: config.styles.postcss.loaderOptions
    }
  ]
};

export default CSS_LOADER;
