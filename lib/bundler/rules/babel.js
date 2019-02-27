export default () => {
  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  return {
    test: /\.(js|mjs|jsx)$/,
    loader: 'babel-loader',
    include: [config.source.js].concat(config.scripts.include)
  };
};
