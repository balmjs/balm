import webpackMiddleware from '../../packages/balm-core/src/middlewares/webpack';
import { webpack } from '../../packages/balm-core/src/bundler/webpack';

describe('Webpack Middleware', function () {
  let middlewares: object[];

  beforeEach(function () {
    middlewares = webpackMiddleware();
  });

  describe('default', function () {
    before(function () {
      BalmJS.webpackCompiler = null;
    });

    const middlewaresCount = 0;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function () {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });

  describe('dev without hot', function () {
    before(function () {
      BalmJS.webpackCompiler = webpack({});
    });

    const middlewaresCount = 1;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function () {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });

  describe('dev with hot', function () {
    before(function () {
      BalmJS.webpackCompiler = webpack({});
      BalmJS.config.server.useHMR = true;
    });

    after(function () {
      BalmJS.config.server.useHMR = false;
    });

    const middlewaresCount = 2;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function () {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });
});
