import getOutput from '../../src/bundler/output';

describe('bundler#getOutput()', function() {
  let result: any = {};

  describe('development', function() {
    beforeEach(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    describe('default', function() {
      const filename = 'js/[name].js';
      const chunkFilename = 'js/async/[id].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function() {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });

    describe('#mix.js()', function() {
      const filename = '[name].js';
      const chunkFilename = '[id].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function() {
          result = getOutput('', balm.config.scripts, true);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });
  });

  describe('production', function() {
    describe('default', function() {
      before(function() {
        balm.config = {
          env: {
            isProd: true
          }
        };
      });

      const filename = 'js/[name].js';
      const chunkFilename = 'js/async/[name].chunk.js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function() {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });

    describe('cache', function() {
      before(function() {
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
      const chunkFilename = 'js/async/[name].[chunkhash:8].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function() {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
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

      const filename = 'js/[name].[contenthash:8].js';
      const chunkFilename = 'js/async/[name].[contenthash:8].js';

      it(
        `expected output: "${filename}"`,
        asyncCase(function() {
          result = getOutput('', balm.config.scripts);

          expect(result.filename).to.equal(filename);
          expect(result.chunkFilename).to.equal(chunkFilename);
        })
      );
    });
  });
});
