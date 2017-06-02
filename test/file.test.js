import path from 'path';
import assert from 'assert';
import fs from 'fs';
import balmConfig from '../test-workspace/balmrc';

describe('Test build files', () => {
  let appDir = path.join(balmConfig.workspace, balmConfig.roots.source);
  let cssDir = path.join(appDir, balmConfig.paths.source.css);

  describe('#sprites', () => {
    let spritesDir = path.join(cssDir, 'sprites');
    it('sprites: `path/to/workspace/app/styles/sprites`', done => {
      fs.exists(spritesDir, exists => {
        assert.ok(exists);
        done();
      });
    });

    let svgDir = path.join(cssDir, 'svg');
    it('svg: `path/to/workspace/app/styles/svg`', done => {
      fs.exists(svgDir, exists => {
        assert.ok(exists);
        done();
      });
    });
  });
});
