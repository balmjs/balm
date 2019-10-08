function htmlLoader(): object {
  return {
    test: /\.(html|tpl)$/,
    loader: 'html-loader',
    options: BalmJS.config.env.isProd
      ? Object.assign({}, BalmJS.config.html.options, {
          removeAttributeQuotes: false
        })
      : {}
  };
}

export default htmlLoader;
