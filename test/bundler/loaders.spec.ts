import getLoaders from '../../packages/balm-core/src/bundler/webpack/loaders';

describe('Bundler#getLoaders()', function() {
  let rules: any = [];

  describe('use defaults', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    const rulesCount = 7;

    it(
      `expected output: ${rulesCount}`,
      asyncCase(function() {
        rules = getLoaders([]);

        expect(rules.length).to.equal(rulesCount);
      })
    );
  });

  describe('use partial defaults', function() {
    before(function() {
      balm.config = {
        scripts: {
          defaultLoaders: {
            url: false,
            file: false
          }
        }
      };
    });

    const rulesCount = 3;

    it(
      `expected output: ${rulesCount}`,
      asyncCase(function() {
        rules = getLoaders([]);

        expect(rules.length).to.equal(rulesCount);
      })
    );
  });

  describe('do not use defaults', function() {
    before(function() {
      balm.config = {
        scripts: {
          defaultLoaders: {
            html: false,
            css: false,
            js: false,
            url: false,
            file: false
          }
        }
      };
    });

    const rulesCount = 0;

    it(
      `expected output: ${rulesCount}`,
      asyncCase(function() {
        rules = getLoaders([]);

        expect(rules.length).to.equal(rulesCount);
      })
    );
  });

  describe('production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        },
        scripts: {
          defaultLoaders: {
            html: true,
            css: true,
            js: true,
            url: true,
            file: true
          },
          extractCss: {
            enabled: true
          }
        }
      };
    });

    const rulesCount = 7;

    it(
      `expected output: ${rulesCount}`,
      asyncCase(function() {
        rules = getLoaders([]);

        expect(rules.length).to.equal(rulesCount);
      })
    );
  });

  describe('SSR', function() {
    before(function() {
      balm.config = {
        env: {
          inSSR: true
        },
        scripts: {
          loaders: [
            {
              test: /\.less$/,
              loader: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            }
          ]
        }
      };
    });

    it(
      '`vue-loader` to `vue-style-loader`',
      asyncCase(function() {
        getLoaders([]);
      })
    );
  });
});
