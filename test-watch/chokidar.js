const APP_JS_SRC = ['app/**/*.js'];
const APP_HTML_SRC = ['app/components/**/*.html'];
const LIB_JS_SRC = ['lib/**/*.js'];

let appFiles = [].concat(APP_JS_SRC, APP_HTML_SRC);
let libFiles = LIB_JS_SRC;

let chokidar = require('chokidar');
chokidar.watch(appFiles).on('all', (event, path) => {
  console.log('app file:', event, path);
});
chokidar.watch(libFiles).on('all', (event, path) => {
  console.log('lib file:', event, path);
});
