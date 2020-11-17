import webpackConfig from '../../packages/balm-core/src/bundler/webpack';

describe('Bundler#webpackConfig()', function () {
  context('web', function () {
    describe('with externals', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            externals: true
          }
        };
      });

      it(
        '`balm.config.scripts.externals` expected output: true',
        asyncCase(function () {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });

    describe('with sourcemap and report', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            sourceMap: true,
            bundleAnalyzerReport: true,
            extractCss: {
              enabled: true
            }
          }
        };
      });

      it(
        '`balm.config.scripts.sourceMap` expected output: true',
        asyncCase(function () {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });

    describe('inject', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            inject: true
          }
        };
      });

      it(
        '`balm.config.scripts.inject` expected output: true',
        asyncCase(function () {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });
  });

  context('vendor extraction', function () {
    describe('default', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            extractAllVendors: true
          }
        };
      });

      it(
        '`balm.config.scripts.inject` expected output: false',
        asyncCase(function () {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });

    describe('inject', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            entry: {
              main: './src/scripts/index.js'
            },
            inject: true,
            extractAllVendors: true
          }
        };
      });

      it(
        '`balm.config.scripts.inject` expected output: true',
        asyncCase(function () {
          webpackConfig(
            {
              main: './src/scripts/index.js'
            },
            'dist'
          );
        })
      );
    });
  });

  describe('IE8', function () {
    before(function () {
      balm.config = {
        scripts: {
          ie8: true
        }
      };
    });

    it(
      'outdated browser',
      asyncCase(function () {
        webpackConfig('', 'dist');
      })
    );
  });

  describe('!web', function () {
    before(function () {
      balm.config = {
        scripts: {
          target: 'node'
        }
      };
    });

    it(
      'node',
      asyncCase(function () {
        webpackConfig('', 'dist');
      })
    );
  });
});
