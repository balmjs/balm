describe('config', function() {
  describe('#source', function() {
    let appDir = path.join(config.workspace, config.roots.source);

    it('source.base should return `path/to/workspace/app`', function() {
      assert.equal(config.source.base, appDir);
    });
    it('source.css should return `path/to/workspace/app/styles`', function() {
      assert.equal(config.source.css, path.join(appDir, config.paths.source.css));
    });
    it('source.js should return `path/to/workspace/app/scripts`', function() {
      assert.equal(config.source.js, path.join(appDir, config.paths.source.js));
    });
    it('source.img should return `path/to/workspace/app/images`', function() {
      assert.equal(config.source.img, path.join(appDir, config.paths.source.img));
    });
    it('source.font should return `path/to/workspace/app/fonts`', function() {
      assert.equal(config.source.font, path.join(appDir, config.paths.source.font));
    });
  });

  describe('#tmp', function() {
    let tmpDir = path.join(config.workspace, config.roots.tmp);

    it('tmp.base should return `path/to/workspace/.tmp`', function() {
      assert.equal(config.tmp.base, tmpDir);
    });
    it('tmp.css should return `path/to/workspace/.tmp/css`', function() {
      assert.equal(config.tmp.css, path.join(tmpDir, config.paths.tmp.css));
    });
    it('tmp.js should return `path/to/workspace/.tmp/js`', function() {
      assert.equal(config.tmp.js, path.join(tmpDir, config.paths.tmp.js));
    });
    it('tmp.img should return `path/to/workspace/.tmp/img`', function() {
      assert.equal(config.tmp.img, path.join(tmpDir, config.paths.tmp.img));
    });
    it('tmp.font should return `path/to/workspace/.tmp/fonts`', function() {
      assert.equal(config.tmp.font, path.join(tmpDir, config.paths.tmp.font));
    });
  });

  describe('#target', function() {
    let distDir = path.join(config.workspace, config.roots.target);
    let distAssetsDir = path.join(distDir, config.assets.subDir);

    it('target.base should return `path/to/workspace/dist`', function() {
      assert.equal(config.target.base, distDir);
    });
    it('target.css should return `path/to/workspace/dist/css`', function() {
      assert.equal(config.target.css, path.join(distAssetsDir, config.paths.target.css));
    });
    it('target.js should return `path/to/workspace/dist/js`', function() {
      assert.equal(config.target.js, path.join(distAssetsDir, config.paths.target.js));
    });
    it('target.img should return `path/to/workspace/dist/img`', function() {
      assert.equal(config.target.img, path.join(distAssetsDir, config.paths.target.img));
    });
    it('target.font should return `path/to/workspace/dist/font`', function() {
      assert.equal(config.target.font, path.join(distAssetsDir, config.paths.target.font));
    });
    it('target.static should return `path/to/workspace/dist`', function() {
      assert.equal(config.target.static, distAssetsDir);
    });
  });

  describe('#assets', function() {
    let assetsDir = path.join(config.assets.root, config.assets.publicPath, config.assets.subDir);

    it('assets.static should return `path/to/assets`', function() {
      assert.equal(config.assets.static, assetsDir);
    });
  });
});
