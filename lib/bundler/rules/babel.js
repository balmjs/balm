export default () => {
  return {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    include: [config.source.js].concat(config.scripts.include)
  };
};
