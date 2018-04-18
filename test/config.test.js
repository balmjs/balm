import balmConfig from '../test-workspace/config/spa/test';
import path from 'path';
import assert from 'assert';

const configTests = () => {
  describe('Test balm config', () => {
    describe('#source', () => {
      let appDir = path.join(balmConfig.workspace, balmConfig.roots.source);

      it('source.base should return `path/to/workspace/src`', () => {
        assert.equal(balm.config.source.base, appDir);
      });
      it('source.css should return `path/to/workspace/src/styles`', () => {
        assert.equal(balm.config.source.css, path.join(appDir, balmConfig.paths.source.css));
      });
      it('source.js should return `path/to/workspace/src/scripts`', () => {
        assert.equal(balm.config.source.js, path.join(appDir, balmConfig.paths.source.js));
      });
      it('source.img should return `path/to/workspace/src/images`', () => {
        assert.equal(balm.config.source.img, path.join(appDir, balmConfig.paths.source.img));
      });
      it('source.font should return `path/to/workspace/src/fonts`', () => {
        assert.equal(balm.config.source.font, path.join(appDir, balmConfig.paths.source.font));
      });
    });

    describe('#tmp', () => {
      let tmpDir = path.join(balmConfig.workspace, '.tmp');

      it('tmp.base should return `path/to/workspace/.tmp`', () => {
        assert.equal(balm.config.tmp.base, tmpDir);
      });
      it('tmp.css should return `path/to/workspace/.tmp/css`', () => {
        assert.equal(balm.config.tmp.css, path.join(tmpDir, balmConfig.paths.target.css));
      });
      it('tmp.js should return `path/to/workspace/.tmp/js`', () => {
        assert.equal(balm.config.tmp.js, path.join(tmpDir, balmConfig.paths.target.js));
      });
      it('tmp.img should return `path/to/workspace/.tmp/img`', () => {
        assert.equal(balm.config.tmp.img, path.join(tmpDir, balmConfig.paths.target.img));
      });
      it('tmp.font should return `path/to/workspace/.tmp/fonts`', () => {
        assert.equal(balm.config.tmp.font, path.join(tmpDir, balmConfig.paths.source.font));
      });
    });

    describe('#target', () => {
      let distDir = path.join(balmConfig.workspace, balmConfig.roots.target);
      let distAssetsDir = path.join(distDir, balmConfig.assets.subDir);

      it('target.base should return `path/to/workspace/dist`', () => {
        assert.equal(balm.config.target.base, distDir);
      });
      it('target.css should return `path/to/workspace/dist/css`', () => {
        assert.equal(balm.config.target.css, path.join(distAssetsDir, balmConfig.paths.target.css));
      });
      it('target.js should return `path/to/workspace/dist/js`', () => {
        assert.equal(balm.config.target.js, path.join(distAssetsDir, balmConfig.paths.target.js));
      });
      it('target.img should return `path/to/workspace/dist/img`', () => {
        assert.equal(balm.config.target.img, path.join(distAssetsDir, balmConfig.paths.target.img));
      });
      it('target.font should return `path/to/workspace/dist/font`', () => {
        assert.equal(balm.config.target.font, path.join(distAssetsDir, balmConfig.paths.target.font));
      });
      it('target.static should return `path/to/workspace/dist`', () => {
        assert.equal(balm.config.target.static, distAssetsDir);
      });
    });

    describe('#assets', () => {
      let assetsDir = path.join(balmConfig.assets.root, balmConfig.assets.publicPath, balmConfig.assets.subDir);

      it('assets.static should return `path/to/remote/assets`', () => {
        assert.equal(balm.config.assets.static, assetsDir);
      });
      it('assets.css should return `path/to/remote/assets/css`', () => {
        assert.equal(balm.config.assets.css, path.join(assetsDir, balmConfig.paths.target.css));
      });
      it('assets.js should return `path/to/remote/assets/js`', () => {
        assert.equal(balm.config.assets.js, path.join(assetsDir, balmConfig.paths.target.js));
      });
      it('assets.img should return `path/to/remote/assets/img`', () => {
        assert.equal(balm.config.assets.img, path.join(assetsDir, balmConfig.paths.target.img));
      });
      it('assets.font should return `path/to/remote/assets/font`', () => {
        assert.equal(balm.config.assets.font, path.join(assetsDir, balmConfig.paths.target.font));
      });
    });
  });
};

export default configTests;
