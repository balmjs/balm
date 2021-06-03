import getOutput from '../../packages/balm-core/src/bundler/webpack/output';

describe('Bundler#getOutput()', function () {
  let result: any = {};

  context('development', function () {
    beforeEach(function () {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    describe('default', function () {
      const filename = 'js/[name].js';
      const chunkFilename = 'js/async/[name].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function () {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });

    describe('#mix.webpack()', function () {
      const filename = '[name].js';
      const chunkFilename = '[name].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function () {
          result = getOutput('', balm.config.scripts, true);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });
  });

  context('production', function () {
    describe('default', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          assets: {
            cache: true
          }
        };
      });

      const filename = 'js/[name].js';
      const chunkFilename = 'js/async/[name].[contenthash:8].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function () {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });

    describe('cache', function () {
      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          assets: {
            cache: true
          }
        };
      });

      const filename = 'js/[name].js';
      const chunkFilename = 'js/async/[name].[contenthash:8].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function () {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
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
            injectHtml: true
          },
          assets: {
            cache: true
          }
        };
      });

      const filename = 'js/[name].[contenthash:8].js';
      const chunkFilename = 'js/async/[name].[contenthash:8].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function () {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });

    describe('custom library', function () {
      const libraryName = 'BalmJS';

      before(function () {
        balm.config = {
          env: {
            isProd: true
          },
          scripts: {
            library: libraryName,
            libraryTarget: 'umd'
          }
        };
      });

      it(
        `expected output: "${libraryName}"`,
        asyncCase(function () {
          result = getOutput('', balm.config.scripts);

          expect(result.library).to.equal(libraryName);
        })
      );
    });
  });

  describe('miniprogram js', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true,
          isMP: true
        }
      };
    });

    const mp = {
      path: path.join(balm.config.workspace, 'dist', 'common'),
      library: 'createApp',
      libraryTarget: 'window',
      libraryExport: 'default'
    };

    it(
      `expected output: "${JSON.stringify(mp)}"`,
      asyncCase(function () {
        result = getOutput('', balm.config.scripts);

        expect(result.path).to.equal(mp.path);
        expect(result.library).to.equal(mp.library);
        expect(result.libraryTarget).to.equal(mp.libraryTarget);
        expect(result.libraryExport).to.equal(mp.libraryExport);
      })
    );
  });
});
