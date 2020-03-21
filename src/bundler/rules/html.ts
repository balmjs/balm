function htmlLoader(): object {
  const options = Object.assign(
    {
      minimize: {
        removeAttributeQuotes: false
      }
    },
    BalmJS.config.scripts.htmlLoaderOptions
  );

  return {
    test: /\.html$/i,
    loader: 'html-loader',
    options
  };
}

export default htmlLoader;
