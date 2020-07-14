import httpProxyMiddleware from '@balm-core/src/middlewares/proxy';

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
    describe('config is an object', function () {
      describe('correct', function () {
        before(function () {
          balm.config = {
            server: {
              proxyConfig: {
                context: '/api',
                options: {
                  target: 'https://balmjs.com'
                }
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
              proxyConfig: {}
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

    describe('config is an array', function () {
      describe('correct', function () {
        before(function () {
          balm.config = {
            server: {
              proxyConfig: [
                {
                  context: '/api/frontend-workflow',
                  options: {
                    target: 'https://balmjs.com'
                  }
                },
                {
                  context: '/api/ui',
                  options: {
                    target: 'https://material.balmjs.com'
                  }
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
              proxyConfig: [{}]
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
            proxyConfig: true
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
            proxyConfig: {
              context: '/api',
              options: {
                target: '',
                changeOrigin: true
              }
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
