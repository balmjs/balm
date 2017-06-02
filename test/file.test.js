// NOTE: test for local
import path from 'path';
import assert from 'assert';
import fs from 'fs';
import balmConfig from '../test-workspace/balmrc';

// describe('Test sprites files', () => {
//   let appDir = path.join(balmConfig.workspace, balmConfig.roots.source);
//   let cssDir = path.join(appDir, balmConfig.paths.source.css);
//
//   describe('#image', () => {
//     let imageStyle = path.join(cssDir, 'sprites', `_${balmConfig.sprites.image[0]}.css`);
//     it('Image sprites: `path/to/workspace/app/styles/sprites/_img-icon.css`', done => {
//       fs.exists(imageStyle, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//
//     let svgStyle = path.join(cssDir, 'svg', `_${balmConfig.sprites.svg[0]}.css`);
//     it('SVG sprites: `path/to/workspace/app/styles/svg/_svg-icon.css`', done => {
//       fs.exists(svgStyle, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//   });
// });

// describe('Test assets files', () => {
//   let publicDir = path.join(balmConfig.assets.root, balmConfig.assets.publicPath, balmConfig.assets.subDir);
//   let viewsDir = path.join(balmConfig.assets.root, 'views');
//
//   describe('#public', () => {
//     let cssFolder = path.join(publicDir, balmConfig.paths.target.css);
//     let jsFolder = path.join(publicDir, balmConfig.paths.target.js);
//     let imgFolder = path.join(publicDir, balmConfig.paths.target.img);
//     let fontFolder = path.join(publicDir, balmConfig.paths.target.font);
//
//     it('CSS: `path/to/remote/assets/public/web/css`', done => {
//       fs.exists(cssFolder, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//
//     it('JS: `path/to/remote/assets/public/web/js`', done => {
//       fs.exists(jsFolder, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//
//     it('Images: `path/to/remote/assets/public/web/img`', done => {
//       fs.exists(imgFolder, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//
//     it('Fonts: `path/to/remote/assets/public/web/font`', done => {
//       fs.exists(fontFolder, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//   });
//
//   describe('#views', () => {
//     let indexFile = path.join(viewsDir, 'home.blade.php');
//     console.log(indexFile);
//     it('Index file: `path/to/remote/assets/views/home.blade.php`', done => {
//       fs.exists(indexFile, exists => {
//         assert.ok(exists);
//         done();
//       });
//     });
//   });
// });
