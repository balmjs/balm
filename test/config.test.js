import path from 'path';
import assert from 'assert';
import balm from '../lib/main';
import balmConfig from './balm.config';

describe('Test balm config', function() {
  it('production should return `true`', function() {
    assert.equal(balm.config.production, balmConfig.production);
  });

  describe('#source', function() {
    let appDir = path.join(balmConfig.workspace, balmConfig.roots.source);

    it('source.base should return `path/to/workspace/app`', function() {
      assert.equal(balm.config.source.base, appDir);
    });
    it('source.css should return `path/to/workspace/app/styles`', function() {
      assert.equal(balm.config.source.css, path.join(appDir, balmConfig.paths.source.css));
    });
    it('source.js should return `path/to/workspace/app/scripts`', function() {
      assert.equal(balm.config.source.js, path.join(appDir, balmConfig.paths.source.js));
    });
    it('source.img should return `path/to/workspace/app/images`', function() {
      assert.equal(balm.config.source.img, path.join(appDir, balmConfig.paths.source.img));
    });
    it('source.font should return `path/to/workspace/app/fonts`', function() {
      assert.equal(balm.config.source.font, path.join(appDir, balmConfig.paths.source.font));
    });
  });

  describe('#tmp', function() {
    let tmpDir = path.join(balmConfig.workspace, '.tmp');

    it('tmp.base should return `path/to/workspace/.tmp`', function() {
      assert.equal(balm.config.tmp.base, tmpDir);
    });
    it('tmp.css should return `path/to/workspace/.tmp/css`', function() {
      assert.equal(balm.config.tmp.css, path.join(tmpDir, balmConfig.paths.target.css));
    });
    it('tmp.js should return `path/to/workspace/.tmp/js`', function() {
      assert.equal(balm.config.tmp.js, path.join(tmpDir, balmConfig.paths.target.js));
    });
    it('tmp.img should return `path/to/workspace/.tmp/img`', function() {
      assert.equal(balm.config.tmp.img, path.join(tmpDir, balmConfig.paths.target.img));
    });
    it('tmp.font should return `path/to/workspace/.tmp/fonts`', function() {
      assert.equal(balm.config.tmp.font, path.join(tmpDir, balmConfig.paths.source.font));
    });
  });

  describe('#target', function() {
    let distDir = path.join(balmConfig.workspace, balmConfig.roots.target);
    let distAssetsDir = path.join(distDir, balmConfig.assets.subDir);

    it('target.base should return `path/to/workspace/dist`', function() {
      assert.equal(balm.config.target.base, distDir);
    });
    it('target.css should return `path/to/workspace/dist/css`', function() {
      assert.equal(balm.config.target.css, path.join(distAssetsDir, balmConfig.paths.target.css));
    });
    it('target.js should return `path/to/workspace/dist/js`', function() {
      assert.equal(balm.config.target.js, path.join(distAssetsDir, balmConfig.paths.target.js));
    });
    it('target.img should return `path/to/workspace/dist/img`', function() {
      assert.equal(balm.config.target.img, path.join(distAssetsDir, balmConfig.paths.target.img));
    });
    it('target.font should return `path/to/workspace/dist/font`', function() {
      assert.equal(balm.config.target.font, path.join(distAssetsDir, balmConfig.paths.target.font));
    });
    it('target.static should return `path/to/workspace/dist`', function() {
      assert.equal(balm.config.target.static, distAssetsDir);
    });
  });

  describe('#assets', function() {
    let assetsDir = path.join(balmConfig.assets.root, balmConfig.assets.publicPath, balmConfig.assets.subDir);

    it('assets.static should return `path/to/remote/assets`', function() {
      assert.equal(balm.config.assets.static, assetsDir);
    });
    it('assets.css should return `path/to/remote/assets/css`', function() {
      assert.equal(balm.config.assets.css, path.join(assetsDir, balmConfig.paths.target.css));
    });
    it('assets.js should return `path/to/remote/assets/js`', function() {
      assert.equal(balm.config.assets.js, path.join(assetsDir, balmConfig.paths.target.js));
    });
    it('assets.img should return `path/to/remote/assets/img`', function() {
      assert.equal(balm.config.assets.img, path.join(assetsDir, balmConfig.paths.target.img));
    });
    it('assets.font should return `path/to/remote/assets/font`', function() {
      assert.equal(balm.config.assets.font, path.join(assetsDir, balmConfig.paths.target.font));
    });
  });

  describe('#html', function() {
    it('html.regex.css should same to `paths.target.css`', function() {
      assert.equal(balm.config.html.regex.css, balmConfig.paths.target.css);
    });
    it('html.regex.js should same to `paths.target.js`', function() {
      assert.equal(balm.config.html.regex.js, balmConfig.paths.target.js);
    });
  });
});
