import { STATIC_ASSETS } from '../../config/constants';

export default () => {
  const PATHNAME = `${config.paths.target.js}/${STATIC_ASSETS}/`;
  const FILENAME = '[name].[hash:8].[ext]';
  const limit = config.scripts.base64Limit;

  return [
    // "url" loader works like "file" loader except that it embeds assets
    // smaller than specified limit in bytes as data URLs to avoid requests.
    // A missing `test` is equivalent to a match.
    {
      test: /\.(bmp|gif|jpe?g|png|svg)(\?.*)?$/,
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
