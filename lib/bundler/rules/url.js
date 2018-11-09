import { STATIC_ASSETS } from '../../config/constants';

export default () => {
  const PATHNAME = `${config.paths.target.js}/${STATIC_ASSETS}/`;
  const FILENAME = config.production
    ? '[name].[hash:9].[ext]'
    : '[name].[hash:5].[ext]';
  const limit = config.scripts.base64Limit;

  return [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit,
        name: BalmFile.assetsPath(`${PATHNAME}${FILENAME}`)
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit,
        name: BalmFile.assetsPath(`${PATHNAME}${FILENAME}`)
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit,
        name: BalmFile.assetsPath(`${PATHNAME}${FILENAME}`)
      }
    }
  ];
};
