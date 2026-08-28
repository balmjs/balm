import httpProxyMiddleware from '../../packages/balm-core/src/middlewares/proxy';

describe('Http Proxy Middleware', function () {
  let middlewares: object[];

  beforeEach(function () {
    middlewares = httpProxyMiddleware();
  });

  describe('non-proxy', function () {
    const middlewaresCount = 0;

    it(
      `expected output: ${middlewaresCount}`,
      asyncCase(function () {
        expect(middlewares.length).to.equal(middlewaresCount);
      })
    );
  });

  describe('proxy', function () {
    context('config is an object', function () {
      describe('correct', function () {
        before(function () {
          balm.config = {
            server: {
              proxyOptions: {
                target: 'https://balmjs.com',
                changeOrigin: true,
                pathFilter: '/api'
              }
            }
          };
        });

        const middlewaresCount = 1;

        it(
          `expected output: ${middlewaresCount}`,
          asyncCase(function () {
            expect(middlewares.length).to.equal(middlewaresCount);
          })
        );
      });

      describe('wrong', function () {
        before(function () {
          balm.config = {
            server: {
              proxyOptions: {}
            }
          };
        });

        const middlewaresCount = 0;

        it(
          `expected output: ${middlewaresCount}`,
          asyncCase(function () {
            expect(middlewares.length).to.equal(middlewaresCount);
          })
        );
      });
    });

    context('config is an array', function () {
      describe('correct', function () {
        before(function () {
          balm.config = {
            server: {
              proxyOptions: [
                {
                  target: 'https://balmjs.com',
                  changeOrigin: true,
                  pathFilter: '/api/frontend-workflow'
                },
                {
                  target: 'https://material.balmjs.com',
                  changeOrigin: true,
                  pathFilter: '/api/ui'
                }
              ]
            }
          };
        });

        const middlewaresCount = 2;

        it(
          `expected output: ${middlewaresCount}`,
          asyncCase(function () {
            expect(middlewares.length).to.equal(middlewaresCount);
          })
        );
      });

      describe('wrong', function () {
        before(function () {
          balm.config = {
            server: {
              proxyOptions: [{}]
            }
          };
        });

        const middlewaresCount = 0;

        it(
          `expected output: ${middlewaresCount}`,
          asyncCase(function () {
            expect(middlewares.length).to.equal(middlewaresCount);
          })
        );
      });
    });

    describe('invalid', function () {
      before(function () {
        balm.config = {
          server: {
            proxyOptions: true
          }
        };
      });

      const middlewaresCount = 0;

      it(
        `expected output: ${middlewaresCount}`,
        asyncCase(function () {
          expect(middlewares.length).to.equal(middlewaresCount);
        })
      );
    });

    describe('error', function () {
      before(function () {
        balm.config = {
          server: {
            proxyOptions: {
              target: '',
              changeOrigin: true,
              pathFilter: '/api'
            }
          }
        };
      });

      const middlewaresCount = 0;

      it(
        `expected output: ${middlewaresCount}`,
        asyncCase(function () {
          expect(middlewares.length).to.equal(middlewaresCount);
        })
      );
    });
  });
});

