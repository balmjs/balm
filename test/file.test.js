import path from 'path';
import assert from 'assert';
import fs from 'fs';
import balmConfig from './balm.config';

describe('Test build files', function() {
  let appDir = path.join(balmConfig.workspace, balmConfig.roots.source);
  let cssDir = path.join(appDir, balmConfig.paths.source.css);

  describe('#sprites', function() {
    let spritesDir = path.join(cssDir, 'sprites');
    it('sprites: `path/to/workspace/app/styles/sprites`', function(done) {
      fs.exists(spritesDir, function(exists) {
        assert.ok(exists);
        done();
      });
    });

    let svgDir = path.join(cssDir, 'svg');
    it('svg: `path/to/workspace/app/styles/svg`', function(done) {
      fs.exists(svgDir, function(exists) {
        assert.ok(exists);
        done();
      });
    });
  });
});
