export default () => {
  return {
    test: /\.(html|tpl)$/,
    loader: 'html-loader',
    options: config.isProd
      ? Object.assign(config.html.options, { removeAttributeQuotes: false })
      : {}
  };
};
