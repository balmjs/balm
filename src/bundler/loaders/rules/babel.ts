export = function(): any {
  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    loader: 'babel-loader',
    include: [BalmJS.config.source.js, ...BalmJS.config.scripts.include]
  };
};
