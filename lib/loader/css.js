import getProcessors from '../plugin/postcss';

const CSS_LOADER = {
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader?importLoaders=1', {
      loader: 'postcss-loader',
      options: {
        plugins: function() {
          return getProcessors;
        }
      }
    }
  ]
};

export default CSS_LOADER;
