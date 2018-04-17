const JS_LOADER = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  include: [
    path.join(config.workspace, config.roots.source, config.paths.source.js)
  ].concat(config.scripts.include)
};

export default JS_LOADER;
