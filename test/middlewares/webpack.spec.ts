import webpackMiddleware from '@balm-core/src/middlewares/webpack';

describe('Webpack Middleware', function() {
  let middlewares: object[];

  beforeEach(function() {
    middlewares = webpackMiddleware();
  });

  describe('default', function() {
    before(function() {
      BalmJS.webpackCompiler = null;
    });

    const middlewaresCount = 0;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function() {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });

  describe('dev without hot', function() {
    before(function() {
      balm.config = {
        scripts: {
          hot: false
        }
      };

      BalmJS.webpackCompiler = webpack({});
    });

    const middlewaresCount = 1;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function() {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });

  describe('dev with hot', function() {
    before(function() {
      balm.config = {
        scripts: {
          hot: true
        }
      };

      BalmJS.webpackCompiler = webpack({});
    });

    const middlewaresCount = 2;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function() {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });
});
