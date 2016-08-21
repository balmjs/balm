# Custom task

```javascript
// File: gulpfile.js

var balm = require('balm');

balm.config = {
  // your project config
  ...,
  useDefault: false
};

balm.go(function(mix) {
  if (balm.config.production) {
    mix.cssmin('./dist/css/**/*.css', './dist/css');
    mix.jsmin('./dist/js/**/*.js', './dist/js');

    mix.zip('./dist/**/*'); // default output: ./archive.zip
    mix.copy('./dist/**/*', '/path/to/project');

    mix.remove(['/path/to/project/public/css', '/path/to/project/public/js']);
    mix.publish(); // publish assets to `config.assets.root/config.assets.publicPath`
    mix.publish('index.html', '/path/to/project/views', {
      suffix: '.blade',
      extname: '.php'
    });
  } else {
    mix.css('./src/css/main.css', './dist/css');
    mix.less('./src/less/main.less', './dist/css');
    mix.sass('./src/sass/main.scss', './dist/css');

    mix.js('./src/scripts/main.js', './dist/js');
  }
});
```