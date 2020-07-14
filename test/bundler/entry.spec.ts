import getEntry from '@balm-core/src/bundler/entry';

const HOT_CLIENT = 'webpack-hot-middleware/client';
const HMR = `${HOT_CLIENT}?reload=true&noInfo=true&path=/__balm_hmr`;

describe('Bundler#getEntry()', function() {
  let entries: any = {};

  describe('entry is an empty array', function() {
    it(
      'expected output: "WARNING"',
      asyncCase(function() {
        entries = getEntry([], balm.config.scripts);
      })
    );
  });

  describe('development', function() {
    beforeEach(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    describe('entry is a string', function() {
      const input = './src/scripts/index.js';
      const output = [input, HMR];

      it(
        `expected output: ${JSON.stringify(output)}`,
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
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an object', function() {
      const input = {
        main: './src/scripts/index.js'
      };
      const output = {
        main: [input.main, HMR]
      };

      it(
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an object with vendors', function() {
      const input = {
        lib: ['jquery'],
        main: './src/scripts/index.js'
      };
      const output = {
        main: [input.main, HMR]
      };

      it(
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });
  });

  describe('production', function() {
    beforeEach(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    describe('entry is a string', function() {
      const input = './src/scripts/index.js';
      const output = input;

      it(
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an array', function() {
      const input = ['./src/scripts/page-1.js', './src/scripts/page-2.js'];
      const output = {
        'page-1': input[0],
        'page-2': input[1]
      };

      it(
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an object', function() {
      const input = {
        main: './src/scripts/index.js'
      };
      const output = input;

      it(
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });

    describe('entry is an object with vendors', function() {
      const input = {
        lib: ['jquery'],
        main: './src/scripts/index.js'
      };
      const output = {
        main: input.main
      };

      it(
        `expected output: ${JSON.stringify(output)}`,
        asyncCase(function() {
          entries = getEntry(input, balm.config.scripts);

          expect(JSON.stringify(entries)).to.equal(JSON.stringify(output));
        })
      );
    });
  });
});
