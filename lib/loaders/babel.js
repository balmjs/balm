let appSrc = path.join(config.workspace, config.roots.source, config.paths.source.js);

const JS_LOADER = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  include: [appSrc].concat([config.scripts.include])
};

export default JS_LOADER;
