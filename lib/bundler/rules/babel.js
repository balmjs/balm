export default () => {
  return {
    test: /\.m?jsx?$/,
    loader: 'babel-loader',
    include: [config.source.js].concat(config.scripts.include)
  };
};
