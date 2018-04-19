const limit = 10000;
const FILENAME = '[name].[ext]';

export default () => {
  return [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit,
        name: File.assetsPath(`${config.paths.target.img}/${FILENAME}`)
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit,
        name: File.assetsPath(`${config.paths.target.media}/${FILENAME}`)
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit,
        name: File.assetsPath(`${config.paths.target.font}/${FILENAME}`)
      }
    }
  ];
};
