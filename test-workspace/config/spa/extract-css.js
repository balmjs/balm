module.exports = {
  entry: {
    'css-a': './spa/scripts/css-page-a.js',
    'css-b': './spa/scripts/css-page-b.js'
  },
  injectHtml: true,
  htmlPluginOptions: {
    title: ['Page 1', 'Page 2']
  },
  extractCss: true
};
