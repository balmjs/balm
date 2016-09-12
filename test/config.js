import path from 'path';
import assert from 'assert';

const testConfig = config => {
  describe('config', function() {
    describe('#source', function() {
      let appDir = path.join(config.workspace, config.roots.source);
      it('base should return `path/to/workspace/app`', function() {
        assert(appDir, config.source.base);
      });
      it('css should return `path/to/workspace/app/styles`', function() {
        assert(path.join(appDir, config.paths.source.css), config.source.css);
      });
      it('js should return `path/to/workspace/app/scripts`', function() {
        assert(path.join(appDir, config.paths.source.js), config.source.js);
      });
      it('image should return `path/to/workspace/app/images`', function() {
        assert(path.join(appDir, config.paths.source.img), config.source.img);
      });
      it('font should return `path/to/workspace/app/fonts`', function() {
        assert(path.join(appDir, config.paths.source.font), config.source.font);
      });
    });
    describe('#tmp', function() {
      let tmpDir = path.join(config.workspace, config.roots.tmp);
      it('base should return `path/to/workspace/.tmp`', function() {
        assert(tmpDir, config.tmp.base);
      });
      it('css should return `path/to/workspace/.tmp/css`', function() {
        assert(path.join(tmpDir, config.paths.tmp.css), config.tmp.css);
      });
      it('js should return `path/to/workspace/.tmp/js`', function() {
        assert(path.join(tmpDir, config.paths.tmp.js), config.tmp.js);
      });
      it('image should return `path/to/workspace/.tmp/img`', function() {
        assert(path.join(tmpDir, config.paths.tmp.img), config.tmp.img);
      });
      it('font should return `path/to/workspace/.tmp/fonts`', function() {
        assert(path.join(tmpDir, config.paths.tmp.font), config.tmp.font);
      });
    });
    describe('#target', function() {
      let distDir = path.join(config.workspace, config.roots.target);
      it('base should return `path/to/workspace/dist`', function() {
        assert(distDir, config.target.base);
      });
      it('css should return `path/to/workspace/dist/css`', function() {
        assert(path.join(distDir, config.paths.target.css), config.target.css);
      });
      it('js should return `path/to/workspace/dist/js`', function() {
        assert(path.join(distDir, config.paths.target.js), config.target.js);
      });
      it('image should return `path/to/workspace/dist/img`', function() {
        assert(path.join(distDir, config.paths.target.img), config.target.img);
      });
      it('font should return `path/to/workspace/dist/font`', function() {
        assert(path.join(distDir, config.paths.target.font), config.target.font);
      });
      it('static should return `path/to/workspace/dist`', function() {
        assert(distDir, config.target.static);
      });
    });
  });
};

export default testConfig;
