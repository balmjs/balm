describe('Config Compatibility Check', function () {
  before(function () {
    balm.config = {
      styles: {
        postcssLoaderOptions: {}
      },
      scripts: {
        disableDefaultLoaders: {}
      }
    };
  });

  it(
    'expected output: "Warning"',
    asyncCase(function () {})
  );
});
