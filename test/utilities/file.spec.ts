import file from '../../src/utilities/file';

describe('Balm File', function() {
  describe('#stylePaths', function() {
    it(
      'style paths',
      asyncCase(function() {
        const stylePath = path.join(balm.config.workspace, '.');

        expect(file.stylePaths[0]).to.equal(stylePath);
      })
    );
  });

  describe('#publicPath', function() {
    describe('in development', function() {
      it(
        'public path expected output: ""',
        asyncCase(function() {
          expect(file.publicPath).to.equal('');
        })
      );
    });

    describe('in production', function() {
      before(function() {
        balm.config = {
          assets: {
            publicUrl: '/'
          }
        };
      });

      it(
        'public path expected output: "/"',
        asyncCase(function() {
          expect(file.publicPath).to.equal('/');
        })
      );
    });
  });

  describe('#assetsSuffixPath', function() {
    describe('in frontend', function() {
      before(function() {
        balm.config = {
          inFrontend: true
        };
      });

      it(
        'assets suffix path',
        asyncCase(function() {
          const assetsSuffixPath = '';

          expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
        })
      );
    });

    describe('in backend and production with cache', function() {
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

      it(
        'assets suffix path',
        asyncCase(function() {
          const assetsSuffixPath = 'build';

          expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
        })
      );
    });

    describe('in backend and production with subDir', function() {
      before(function() {
        balm.config = {
          inFrontend: false,
          env: {
            isProd: true
          },
          assets: {
            subDir: 'web',
            cache: false
          }
        };
      });

      it(
        'assets suffix path',
        asyncCase(function() {
          const assetsSuffixPath = 'web';

          expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
        })
      );
    });

    describe('in backend and production with subDir and cache', function() {
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

      it(
        'assets suffix path',
        asyncCase(function() {
          const assetsSuffixPath = 'web/build';

          expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
        })
      );
    });
  });

  describe('#absPaths()', function() {
    it(
      'absolute path',
      asyncCase(function() {
        const result = file.absPaths('foo');
        const absPath = path.join(balm.config.workspace, 'foo');

        expect(result).to.equal(absPath);
      })
    );

    it(
      'absolute paths',
      asyncCase(function() {
        const result = file.absPaths(['foo', '!bar']);
        const absPaths = [
          path.join(balm.config.workspace, 'foo'),
          '!' + path.join(balm.config.workspace, 'bar')
        ];

        expect(result[0]).to.equal(absPaths[0]);
        expect(result[1]).to.equal(absPaths[1]);
      })
    );
  });

  describe('#assetsPath()', function() {
    describe('in development', function() {
      before(function() {
        balm.config = {
          env: {
            isDev: true
          },
          inFrontend: true
        };
      });

      it(
        'assets path in development',
        asyncCase(function() {
          const result = file.assetsPath('foo');

          expect(result).to.equal('foo');
        })
      );
    });

    describe('in production', function() {
      before(function() {
        balm.config = {
          env: {
            isProd: true
          },
          inFrontend: false,
          assets: {
            subDir: 'web'
          }
        };
      });

      it(
        'assets path in development',
        asyncCase(function() {
          const result = file.assetsPath('foo');
          const assetsPath = path.join(file.assetsSuffixPath, 'foo');

          expect(result).to.equal(assetsPath);
        })
      );
    });
  });
});
