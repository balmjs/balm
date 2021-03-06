import historyMiddleware from '../../packages/balm-core/src/middlewares/history';

describe('History Middleware', function () {
  let middlewares: object[];

  beforeEach(function () {
    middlewares = historyMiddleware();
  });

  describe('default', function () {
    const middlewaresCount = 0;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function () {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });

  context('H5 history', function () {
    const middlewaresCount = 1;

    describe('!object', function () {
      before(function () {
        balm.config = {
          server: {
            historyOptions: true
          }
        };
      });

      it(
        `expected output: ${middlewaresCount}`,
        asyncCase(function () {
          expect(middlewares.length).to.equal(middlewaresCount);
        })
      );
    });

    describe('object', function () {
      before(function () {
        balm.config = {
          server: {
            historyOptions: {
              index: '/default.html'
            }
          }
        };
      });

      it(
        `expected output: ${middlewaresCount}`,
        asyncCase(function () {
          expect(middlewares.length).to.equal(middlewaresCount);
        })
      );
    });
  });
});
