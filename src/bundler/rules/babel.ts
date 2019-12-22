function jsLoader(): object {
  // Process application JS with Babel.
  // The preset includes JSX, Flow, TypeScript, and some ESnext features.
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    loader: 'babel-loader',
    include: [
      BalmJS.file.absPaths(BalmJS.config.src.js),
      ...BalmJS.config.scripts.includeJsResource
    ]
  };
}

export default jsLoader;
