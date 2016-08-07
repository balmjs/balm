## Custom task

```js
// File: gulpfile.js

var balm = require('balm');

balm.config = {
  // your project config
  ...,
  useDefault: false
};

balm.go(function(mix) {
  mix.css('./src/css/main.css', './dist/css');
  mix.less('./src/less/main.less', './dist/css');
  mix.sass('./src/sass/main.scss', './dist/css');

  mix.js('./src/scripts/main.js', './dist/js');

  if (balm.config.production) {
    mix.cssmin('./dist/css/**/*.css', './dist/css');
    mix.jsmin('./dist/js/**/*.js', './dist/js');

    mix.zip('./dist/**/*'); // default output: ./archive.zip
    mix.copy('./dist/**/*', '/path/to/yours');

    mix.copy('/src/templates/*.html', '/path/to/yours/tpl', {
      suffix: '.blade',
      extname: '.php'
    });
  }
});
```
