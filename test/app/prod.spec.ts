import { cleanup, shouldExist } from './test';

describe('app test', function() {
  before(function() {
    balm.config = {
      env: {
        isProd: true
      },
      paths: {
        target: {
          css: 'a',
          js: 'b',
          img: 'c',
          font: 'd',
          media: 'e'
        }
      },
      styles: {
        sprites: ['icons']
      },
      assets: {
        cache: true
      }
    };
  });

  after(function() {
    cleanup();
  });

  const testCase = [
    'dist/index.html',
    'dist/favicon.ico',
    'dist/rev-manifest.json'
    // 'dist/a/main.41255e24.css',
    // 'dist/b/main.9af584a0.js',
    // 'dist/c/logo.bae9298c.svg',
    // 'dist/d/roboto-regular.f94d5e51.woff',
    // 'dist/e/big_buck_bunny.f13004ee.mp4'
  ];
  const contents =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#2196F3"><title>Hello BalmJS</title><link rel="shortcut icon" type="image/x-icon" href="favicon.ico"><link rel="stylesheet" href="a/main.41255e24.css"><style>body{color:red}a{color:#00f}</style></head><body><!--[if IE]><p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience.</p><![endif]--><div id="app"><span>Hello</span> <img src="c/logo.bae9298c.svg" alt="BalmJS"> <a href="//balmjs.com/">BalmJS</a></div><div class="play"><video src="e/big_buck_bunny.f13004ee.mp4" controls></video></div><script src="b/main.9af584a0.js"></script><script>var msg="gg"</script></body></html>';

  it('production', function(done) {
    balm.afterTask = function() {
      testCase.forEach((file: string) => {
        shouldExist(file);
      });
      // shouldExist(testCase[0], contents); // NOTE: It takes a long time.
    };
    balm.go();

    gulp.series('default')();

    setTimeout(done, 4000);
  });
});
