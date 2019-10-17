import file from '../../src/utilities/file';

describe('Balm File', function() {
  describe('#stylePaths', function() {
    const stylePath = path.join(balm.config.workspace, '.');

    it(
      `expected output: "${stylePath}"`,
      asyncCase(function() {
        expect(file.stylePaths[0]).to.equal(stylePath);
      })
    );
  });

  describe('#publicPath', function() {
    describe('in development', function() {
      before(function() {
        balm.config = {
          env: {
            isDev: true
          }
        };
      });
      const publicUrl = '';

      it(
        `expected output: "${publicUrl}"`,
        asyncCase(function() {
          expect(file.publicPath).to.equal(publicUrl);
        })
      );
    });

    describe('in production', function() {
      before(function() {
        balm.config = {
          env: {
            isProd: true
          },
          assets: {
            publicUrl: 'https://balmjs.com/'
          }
        };
      });
      const publicUrl = 'https://balmjs.com/';

      it(
        `expected output: "${publicUrl}"`,
        asyncCase(function() {
          expect(file.publicPath).to.equal(publicUrl);
        })
      );
    });

    describe('has public url', function() {
      before(function() {
        balm.config = {
          assets: {
            publicUrl: '/'
          }
        };
      });
      const publicUrl = '/';

      it(
        `expected output: "${publicUrl}"`,
        asyncCase(function() {
          expect(file.publicPath).to.equal(publicUrl);
        })
      );
    });
  });

  describe('#assetsSuffixPath', function() {
    describe('in frontend', function() {
      describe('!subDir', function() {
        before(function() {
          balm.config = {
            inFrontend: true,
            assets: {
              subDir: ''
            }
          };
        });

        const assetsSuffixPath = '';

        it(
          `expected output: "${assetsSuffixPath}"`,
          asyncCase(function() {
            expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
          })
        );
      });

      describe('subDir', function() {
        before(function() {
          balm.config = {
            inFrontend: true,
            assets: {
              subDir: 'web'
            }
          };
        });

        const assetsSuffixPath = 'web';

        it(
          `expected output: "${assetsSuffixPath}"`,
          asyncCase(function() {
            expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
          })
        );
      });
    });

    describe('production with cache in backend', function() {
      describe('!subDir', function() {
        before(function() {
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

        const assetsSuffixPath = 'build';

        it(
          `expected output: "${assetsSuffixPath}"`,
          asyncCase(function() {
            expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
          })
        );
      });

      describe('subDir', function() {
        before(function() {
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

        const assetsSuffixPath = path.join('web', 'build');

        it(
          `expected output: "${assetsSuffixPath}"`,
          asyncCase(function() {
            expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
          })
        );
      });
    });
  });

  describe('#absPaths()', function() {
    const absPath = path.join(balm.config.workspace, 'foo');

    it(
      `expected output: "${absPath}"`,
      asyncCase(function() {
        const result = file.absPaths('foo');

        expect(result).to.equal(absPath);
      })
    );

    const absPaths = [
      path.join(balm.config.workspace, 'foo'),
      '!' + path.join(balm.config.workspace, 'bar')
    ];

    it(
      `expected output: "${absPaths}"`,
      asyncCase(function() {
        const result = file.absPaths(['foo', '!bar']);

        expect(result[0]).to.equal(absPaths[0]);
        expect(result[1]).to.equal(absPaths[1]);
      })
    );
  });

  describe('#assetsPath()', function() {
    describe('in development', function() {
      before(function() {
        balm.config = {
          inFrontend: true,
          env: {
            isDev: true
          }
        };
      });

      const assetsPath = 'foo';

      it(
        `expected output: "${assetsPath}"`,
        asyncCase(function() {
          const result = file.assetsPath('foo');

          expect(result).to.equal(assetsPath);
        })
      );
    });

    describe('in production', function() {
      before(function() {
        balm.config = {
          inFrontend: false,
          env: {
            isProd: true
          },
          assets: {
            subDir: 'web'
          }
        };
      });

      it(
        `expected output: "${path.posix.join('web', 'foo')}"`,
        asyncCase(function() {
          const result = file.assetsPath('foo');
          const assetsPath = path.posix.join(file.assetsSuffixPath, 'foo');

          expect(result).to.equal(assetsPath);
        })
      );
    });
  });
});