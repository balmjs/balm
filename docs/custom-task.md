## Custom Task API

- files
    - `copy(from, to, renameOptions = {})`
    - `remove(src)`
- stylesheets
    - `css(input, output)`
    - `less(input, output)`
    - `sass(input, output)`
    - `cssmin(input, output, renameOptions = {suffix: '.min'})`
- scripts
    - `js(input, output)`
    - `jsmin(input, output, renameOptions = {suffix: '.min'})`
- assets
    - `version(input, output, renameOptions = {})`
    - `zip(input = '', output = '')`
    - `ftp(input)`
    - `publish(input = '', output = '', renameOptions = {})`

> `mix.end` is deprecated since 0.10.0, you can set `balm.config.afterTask`

__File: gulpfile.js__

```js
var balm = require('balm');

balm.config = {
  // your project config
  useDefault: false, // don't start balm default task
  ...
};

balm.go(function(mix) {
  if (balm.config.production) {
    mix.cssmin('./dist/css/**/*.css', 'dist/css');
    mix.jsmin('./dist/js/**/*.js', 'dist/js');

    mix.copy('./dist/**/*', 'copy-dest');
    mix.remove('./src/somefile.txt');

    mix.zip('./dist/**/*', '.'); // default output: ./archive.zip
    mix.ftp('archive.zip');

    mix.publish(); // publish assets to `config.assets.root/config.assets.publicPath`
    mix.publish('index.html', 'views', { // publish template to  `config.assets.root/views`
      basename: 'new-filename',
      suffix: '.blade',
      extname: '.php'
    });
  } else {
    mix.css('./src/css/main.css', 'compile');
    mix.less('./src/less/main.less', 'compile');
    mix.sass('./src/sass/main.scss', 'compile');

    mix.js('./src/scripts/main.js', 'compile');
  }
});
```
