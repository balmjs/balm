describe('Config Compatibility Check', function () {
  before(function () {
    balm.config = {
      styles: {
        minified: true,
        postcssLoaderOptions: {},
        darkSass: true
      },
      scripts: {
        disableDefaultLoaders: {},
        options: {},
        inject: true,
        useCache: true
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
    delete balm.config.scripts.inject;
    delete balm.config.styles.darkSass;
    delete balm.config.scripts.useCache;
  });
});
