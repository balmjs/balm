## Custom Task API

- server
    - `server()`
- files
    - `copy(from, to, renameOptions = {})`
    - `remove(src)`
- stylesheets
    - `css(input, output)`
    - `less(input, output)`
    - `sass(input, output)`
    - `buildStyle()`
    - `cssmin(input, output, renameOptions = {suffix: '.min'})`
- scripts
    - `js(input, output)`
    - `jsmin(input, output, renameOptions = {suffix: '.min'})`
- assets
    - `version(input, output, renameOptions = {})`
    - `zip(input = '', output = '')`
    - `ftp(input)`
    - `publish(input = '', output = '', renameOptions = {})`

> <del>`mix.end`</del> is deprecated in 0.10.0
> <del>`balm.config.afterTask`</del> is deprecated in 0.14.0

__File: gulpfile.js__

```js
var balm = require('balm');

balm.config = {
  useDefault: false, // don't start balm default tasks
  // Your project config (see BalmJS Configuration Docs)
  ...
};

// Do something before all tasks. New in 0.14.0
balm.beforeTask = () => {
  console.log('Hello BalmJS');
};

// Do something after all tasks. New in 0.14.0
balm.afterTask = () => {
  console.log('gg');
};

balm.go(function(mix) {
  if (balm.config.production) {
    mix.sass(); // compile all sass files
    mix.buildStyle(); // rename 'images,fonts' to 'img,font' in compiled css files

    mix.cssmin('./dist/css/**/*.css', 'dist/css');
    mix.jsmin('./dist/js/**/*.js', 'dist/js');

    mix.copy('./dist/**/*', 'copy-dest');
    mix.remove('./src/somefile.txt');

    mix.zip('./dist/**/*', '.'); // default output: ./archive.zip
    mix.ftp('archive.zip');

    mix.publish(); // publish assets to `config.assets.root/config.assets.publicPath`
    mix.publish('index.html', 'views', { // publish html template to `config.assets.root/views`
      basename: 'new-filename',
      suffix: '.blade',
      extname: '.php'
    });
  } else {
    mix.css('./src/css/main.css', 'compile');
    mix.less('./src/less/main.less', 'compile');
    mix.sass('./src/sass/main.scss', 'compile');

    mix.js('./src/scripts/main.js', 'compile');

    mix.server();
  }
});
```
