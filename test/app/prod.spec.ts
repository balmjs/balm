import { cleanup, runTest } from './test';

describe('App Test in production', function () {
  before(function () {
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
        sprites: ['icons', 'mdi']
      },
      assets: {
        cache: true
      },
      pwa: {
        enabled: true
      }
    };
  });

  after(function () {
    cleanup();
  });

  it('expected output: "dist"', function (done) {
    let testCase = [
      'dist/index.html',
      'dist/favicon.ico',
      'dist/rev-manifest.json'
      // 'dist/a/main.41255e24.css',
      // 'dist/b/main.9af584a0.js',
      // 'dist/c/logo.bae9298c.svg',
      // 'dist/d/roboto-regular.f94d5e51.woff',
      // 'dist/e/big_buck_bunny.f13004ee.mp4'
    ];

    const input = 'index.html';
    const output = 'views';
    const renameOptions = {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    };

    runTest(
      {
        testCase,
        testHook: (mix: any) => {
          // publish assets
          mix.publish();
          // publish templates
          mix.publish(input, output, renameOptions);
          mix.publish([
            {
              input: 'page-a.html',
              output: 'views/a',
              renameOptions: {
                extname: '.phtml'
              }
            },
            {
              input: 'page-b.html',
              output: 'views/b',
              renameOptions: {
                extname: '.phtml'
              }
            }
          ]);
        }
      },
      {
        done,
        delay: 4000
      }
    );
  });

  it('publish assets & templates to remote', function (done) {
    const testCase = [
      'assets/public/a/main.41255e24.css',
      'assets/public/b/main.9af584a0.js',
      'assets/views/home.blade.php',
      'assets/views/a/page-a.phtml',
      'assets/views/b/page-b.phtml'
    ];

    runTest(testCase, done);
  });
});
