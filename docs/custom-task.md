## Custom Task

- stylesheets
    - css
    - less
    - sass
    - cssmin
- scripts
    - js
    - jsmin
- others
    - copy
    - remove
    - zip
    - ftp
- tasks
    - end

__File: gulpfile.js__

```js
var balm = require('balm');

balm.config = {
  // your project config
  ...,
  useDefault: false // don't start balm default task
};

balm.go(function(mix) {
  if (balm.config.production) {
    mix.cssmin('dist/css/**/*.css', 'dist/css');
    mix.jsmin('dist/js/**/*.js', 'dist/js');

    mix.copy('/path/to/dist/**/*', '/path/to/project');
    mix.zip('dist/**/*', '.'); // default output: ./archive.zip
    mix.ftp('archive.zip');

    mix.remove(['/path/to/project/public/css', '/path/to/project/public/js']);
    mix.publish(); // publish assets to `config.assets.root/config.assets.publicPath`
    mix.publish('index.html', '/path/to/project/views', {
      suffix: '.blade',
      extname: '.php'
    });
  } else {
    mix.css('src/css/main.css', 'dist/css');
    mix.less('src/less/main.less', 'dist/css');
    mix.sass('src/sass/main.scss', 'dist/css');

    mix.js('./src/scripts/main.js', 'dist/js');
  }

  mix.end(function() {
    // your tasks
  });
});
```
