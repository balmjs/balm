describe('Config Compatibility Check', function () {
  before(function () {
    balm.config = {
      styles: {
        minified: true,
        postcssLoaderOptions: {}
      },
      scripts: {
        disableDefaultLoaders: {},
        options: {}
      },
      images: {
        defaultPlugins: {}
      }
    };
  });

  it(
    'expected output: "Warning"',
    asyncCase(function () {})
  );

  after(function () {
    delete balm.config.styles.minified;
    delete balm.config.styles.postcssLoaderOptions;
    delete balm.config.scripts.disableDefaultLoaders;
    delete balm.config.scripts.options;
    delete balm.config.images.defaultPlugins;
  });
});
