const HTML_LOADER = {
  test: /\.(html|tpl)$/,
  loader: 'html-loader',
  options: config.production
    ? Object.assign(config.html.options, {removeAttributeQuotes: false})
    : {}
};

export default HTML_LOADER;
