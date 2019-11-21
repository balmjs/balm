import webpackConfig from '../../src/bundler';

describe('Bundler#webpackConfig()', function() {
  describe('web', function() {
    describe('with externals', function() {
      before(function() {
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
        asyncCase(function() {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });

    describe('with sourcemap and report', function() {
      before(function() {
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
        asyncCase(function() {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });

    describe('inject', function() {
      before(function() {
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
        asyncCase(function() {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });
  });

  describe('vendor extraction', function() {
    describe('default', function() {
      before(function() {
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
        asyncCase(function() {
          webpackConfig(balm.config.scripts.entry, 'dist');
        })
      );
    });

    describe('inject', function() {
      before(function() {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            entry: {
              main: './src/scripts/main.js'
            },
            inject: true,
            extractAllVendors: true
          }
        };
      });

      it(
        '`balm.config.scripts.inject` expected output: true',
        asyncCase(function() {
          webpackConfig(
            {
              main: './src/scripts/main.js'
            },
            'dist'
          );
        })
      );
    });
  });

  describe('!web', function() {
    before(function() {
      balm.config = {
        scripts: {
          target: 'node'
        }
      };
    });

    it(
      'node',
      asyncCase(function() {
        webpackConfig('', 'dist');
      })
    );
  });
});
