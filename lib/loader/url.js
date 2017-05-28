import {assetsPath} from '../helper';

let filename = config.production
  ? '[name].[hash:7].[ext]'
  : '[name].[ext]';

const URL_LOADER = [
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: assetsPath(`${config.paths.target.img}/${filename}`)
    }
  }, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: assetsPath(`${config.paths.target.font}/${filename}`)
    }
  }
];

export default URL_LOADER;
