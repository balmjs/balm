import {assetsPath} from '../helper';

const URL_LOADER = [
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: assetsPath(`${config.paths.target.img}/[name].[hash:7].[ext]`)
    }
  }, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: assetsPath(`${config.paths.target.font}/[name].[hash:7].[ext]`)
    }
  }
];

export default URL_LOADER;
