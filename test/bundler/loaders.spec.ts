import getLoaders from '../../src/bundler/loaders';

describe('bundler#getOutput()', function() {
  let rules: any = [];

  describe('use defaults', function() {
    const rulesCount = 6;

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
          disableDefaultLoaders: {
            url: false
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
          disableDefaultLoaders: {
            html: false,
            css: false,
            js: false,
            url: false
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
});
