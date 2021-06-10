import CleanTask from '../../../packages/balm-core/src/tasks/private/clean';

describe('Clean Task', function () {
  let cleanTask: any;

  beforeEach(function (done) {
    cleanTask = new CleanTask();
    cleanTask.fn(done);
  });

  context('in frontend', function () {
    describe('development', function () {
      before(function () {
        balm.config = {
          env: {
            isDev: true
          }
        };
      });

      const dirInFrontend = [node.path.join(balm.config.workspace, '.tmp')];

      it(
        `expected output: ${dirInFrontend}`,
        asyncCase(function () {
          expect(JSON.stringify(cleanTask.dirInFrontend)).to.equal(
            JSON.stringify(dirInFrontend)
          );
        })
      );
    });

    describe('production', function () {
      context('with local', function () {
        describe('!subDir', function () {
          before(function () {
            balm.config = {
              env: {
                isProd: true
              },
              assets: {
                root: 'assets',
                subDir: ''
              }
            };
          });

          const dirInFrontend = [
            node.path.join(balm.config.workspace, 'dist'),
            'assets'
          ];

          it(
            `expected output: ${dirInFrontend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInFrontend)).to.equal(
                JSON.stringify(dirInFrontend)
              );
            })
          );
        });

        describe('subDir', function () {
          before(function () {
            balm.config = {
              env: {
                isProd: true
              },
              assets: {
                root: 'assets',
                subDir: 'web'
              }
            };
          });

          const dirInFrontend = [
            node.path.join(balm.config.workspace, 'dist'),
            'assets'
          ];

          it(
            `expected output: ${dirInFrontend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInFrontend)).to.equal(
                JSON.stringify(dirInFrontend)
              );
            })
          );
        });
      });

      describe('with empty remote', function () {
        before(function () {
          balm.config = {
            env: {
              isProd: true
            },
            assets: {
              root: ''
            }
          };
        });

        const dirInFrontend = [node.path.join(balm.config.workspace, 'dist')];

        it(
          `expected output: ${dirInFrontend}`,
          asyncCase(function () {
            expect(JSON.stringify(cleanTask.dirInFrontend)).to.equal(
              JSON.stringify(dirInFrontend)
            );
          })
        );
      });

      context('with remote', function () {
        describe('!subDir', function () {
          before(function () {
            balm.config = {
              env: {
                isProd: true
              },
              assets: {
                root: '/assets',
                subDir: ''
              }
            };
          });

          const dirInFrontend = [
            node.path.join(balm.config.workspace, 'dist'),
            '/assets/public/css',
            '/assets/public/js',
            '/assets/public/img',
            '/assets/public/font',
            '/assets/public/media'
          ];

          it(
            `expected output: ${dirInFrontend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInFrontend)).to.equal(
                JSON.stringify(dirInFrontend)
              );
            })
          );
        });

        describe('subDir', function () {
          before(function () {
            balm.config = {
              env: {
                isProd: true
              },
              assets: {
                root: '/assets',
                subDir: 'web'
              }
            };
          });

          const dirInFrontend = [
            node.path.join(balm.config.workspace, 'dist'),
            node.path.join('/', 'assets', 'public', 'web')
          ];

          it(
            `expected output: ${dirInFrontend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInFrontend)).to.equal(
                JSON.stringify(dirInFrontend)
              );
            })
          );
        });
      });
    });
  });

  describe('in backend', function () {
    context('development', function () {
      describe('!subDir', function () {
        before(function () {
          balm.config = {
            inFrontend: false,
            env: {
              isDev: true
            },
            assets: {
              subDir: ''
            }
          };
        });
        const dirInBackend = [
          'public/css',
          'public/js',
          'public/img',
          'public/font',
          'public/media'
        ];
        it(
          `expected output: ${dirInBackend}`,
          asyncCase(function () {
            expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
              JSON.stringify(dirInBackend)
            );
          })
        );
      });

      describe('subDir', function () {
        before(function () {
          balm.config = {
            inFrontend: false,
            env: {
              isDev: true
            },
            assets: {
              subDir: 'web'
            }
          };
        });
        const dirInBackend = [
          'public/web/css',
          'public/web/js',
          'public/web/img',
          'public/web/font',
          'public/web/media'
        ];
        it(
          `expected output: ${dirInBackend}`,
          asyncCase(function () {
            expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
              JSON.stringify(dirInBackend)
            );
          })
        );
      });
    });

    context('production', function () {
      describe('non-cache', function () {
        describe('!subDir', function () {
          before(function () {
            balm.config = {
              inFrontend: false,
              env: {
                isProd: true
              },
              assets: {
                subDir: ''
              }
            };
          });

          const dirInBackend = [
            'public/css',
            'public/js',
            'public/img',
            'public/font',
            'public/media'
          ];

          it(
            `expected output: ${dirInBackend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
                JSON.stringify(dirInBackend)
              );
            })
          );
        });

        describe('subDir', function () {
          before(function () {
            balm.config = {
              inFrontend: false,
              env: {
                isProd: true
              },
              assets: {
                subDir: 'web',
                cache: true
              }
            };
          });

          const dirInBackend = [node.path.join('public', 'web', 'build')];

          it(
            `expected output: ${dirInBackend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
                JSON.stringify(dirInBackend)
              );
            })
          );
        });
      });

      describe('cache', function () {
        describe('!subDir', function () {
          before(function () {
            balm.config = {
              inFrontend: false,
              env: {
                isProd: true
              },
              assets: {
                subDir: '',
                cache: true
              }
            };
          });

          const dirInBackend = [node.path.join('public', 'build')];

          it(
            `expected output: ${dirInBackend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
                JSON.stringify(dirInBackend)
              );
            })
          );
        });

        describe('subDir', function () {
          before(function () {
            balm.config = {
              inFrontend: false,
              env: {
                isProd: true
              },
              assets: {
                subDir: 'web',
                buildDir: '',
                cache: true
              }
            };
          });

          const dirInBackend = [node.path.join('public', 'web')];

          it(
            `expected output: ${dirInBackend}`,
            asyncCase(function () {
              expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
                JSON.stringify(dirInBackend)
              );
            })
          );
        });
      });

      describe('duplicated paths', function () {
        before(function () {
          balm.config = {
            inFrontend: false,
            env: {
              isProd: true
            },
            paths: {
              target: {
                media: 'img'
              }
            },
            assets: {
              subDir: ''
            }
          };
        });

        const dirInBackend = [
          'public/css',
          'public/js',
          'public/img',
          'public/font'
        ];

        it(
          `expected output: ${dirInBackend}`,
          asyncCase(function () {
            expect(JSON.stringify(cleanTask.dirInBackend)).to.equal(
              JSON.stringify(dirInBackend)
            );
          })
        );
      });
    });
  });
});
