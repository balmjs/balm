export default () => {
  return {
    test: /\.(html|tpl)$/,
    loader: 'html-loader',
    options: config.production
      ? Object.assign(config.html.options, { removeAttributeQuotes: false })
      : {}
  };
};
