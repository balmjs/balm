const APP_JS_SRC = ['app/**/*.js'];
const APP_HTML_SRC = ['app/components/**/*.html'];
const LIB_JS_SRC = ['lib/**/*.js'];

let appFiles = [].concat(APP_JS_SRC, APP_HTML_SRC);
let libFiles = LIB_JS_SRC;

function doAppStuff(cb) {
  console.log('app file changed');
  cb();
}

function doLibStuff(cb) {
  console.log('lib file changed');
  cb();
}

let gulp = require('gulp');
gulp.watch(appFiles, doAppStuff);
gulp.watch(libFiles, doLibStuff);
