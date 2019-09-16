export = function(): any {
  return {
    test: /\.(html|tpl)$/,
    loader: 'html-loader',
    options: BalmJS.config.env.isProd
      ? Object.assign(BalmJS.config.html.options, {
          removeAttributeQuotes: false
        })
      : {}
  };
};
