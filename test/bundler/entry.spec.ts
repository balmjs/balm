import getEntry from '../../src/bundler/entry';

const HMR =
  'webpack-hot-middleware/client?reload=true&noInfo=true&path=/__balm_hmr';

describe('bundler#getEntry()', function() {
  let entries: any = {};

  describe('development', function() {
    beforeEach(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    describe('entry is a string', function() {
      const input = './src/scripts/main.js';
      const output = [input, HMR];

      it(
        `expected output: "${JSON.stringify(output)}"`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an array', function() {
      const input = ['./src/scripts/page-1.js', './src/scripts/page-2.js'];
      const output = {
        'page-1': [input[0], HMR],
        'page-2': [input[1], HMR]
      };

      it(
        `expected output: "${JSON.stringify(output)}"`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an object', function() {
      const input = {
        main: './src/scripts/main.js'
      };
      const output = {
        main: [input.main, HMR]
      };

      it(
        `expected output: "${JSON.stringify(output)}"`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });
  });
});
