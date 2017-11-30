let filename = '[name].[ext]';

const URL_LOADER = [
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: File.assetsPath(`${config.paths.target.img}/${filename}`)
    }
  }, {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: File.assetsPath(`${config.paths.target.media}/${filename}`)
    }
  }, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: File.assetsPath(`${config.paths.target.font}/${filename}`)
    }
  }
];

export default URL_LOADER;
