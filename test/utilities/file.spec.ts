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
    describe('in Dev', function() {
      it(
        'public path expected output: ""',
        asyncCase(function() {
          expect(file.publicPath).to.equal('');
        })
      );
    });

    describe('in Prod', function() {
      before(function() {
        balm.config.assets.publicUrl = '/';
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
    it(
      'assets suffix path',
      asyncCase(function() {
        const assetsSuffixPath = path.join(
          balm.config.assets.subDir,
          balm.config.assets.buildDir
        );

        expect(file.assetsSuffixPath).to.equal(assetsSuffixPath);
      })
    );
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
    describe('in Dev', function() {
      it(
        'assets path in Dev',
        asyncCase(function() {
          const result = file.assetsPath('foo');

          expect(result).to.equal('foo');
        })
      );
    });

    describe('in Prod', function() {
      before(function() {
        balm.config.inFrontend = false;
        balm.config.assets.subDir = 'web';
        balm.config.assets.buildDir = 'build';
      });

      it(
        'assets path in Dev',
        asyncCase(function() {
          const result = file.assetsPath('foo');
          const assetsPath = path.join(file.assetsSuffixPath, 'foo');

          expect(result).to.equal(assetsPath);
        })
      );
    });
  });
});
