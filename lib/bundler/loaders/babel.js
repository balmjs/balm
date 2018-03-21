const JS_LOADER = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  include: [config.source.js].concat(config.scripts.include)
};

export default JS_LOADER;
