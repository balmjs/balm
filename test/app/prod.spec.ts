import { cleanup, runTest } from './test';

describe('App Test in production', function() {
  beforeEach(function() {
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
      assets: {
        cache: true
      }
    };
  });

  after(function() {
    cleanup();
  });

  it('expected output: "dist"', function(done) {
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

    const input = 'index.html';
    const output = 'views';
    const options = {
      basename: 'home',
      suffix: '.blade',
      extname: '.php'
    };

    runTest(
      {
        testCase,
        hook: (mix: any) => {
          // publish assets
          mix.publish();
          // publish templates
          mix.publish(input, output, options);
          mix.publish([
            {
              input: 'page-a.html',
              output: 'views/a',
              options: {
                extname: '.phtml'
              }
            },
            {
              input: 'page-b.html',
              output: 'views/b',
              options: {
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

  it('publish assets to remote', function(done) {
    const testCase = [
      'assets/public/a/main.41255e24.css',
      'assets/public/b/main.9af584a0.js'
      // 'assets/public/c/logo.bae9298c.svg',
      // 'assets/public/d/roboto-regular.f94d5e51.woff',
      // 'assets/public/e/big_buck_bunny.f13004ee.mp4'
    ];

    runTest(
      {
        testCase
      },
      done
    );
  });

  it('publish one template to remote', function(done) {
    const testCase = 'assets/views/home.blade.php';

    runTest(
      {
        testCase
      },
      done
    );
  });

  it('publish multiple templates to remote', function(done) {
    const testCase = [
      'assets/views/a/page-a.phtml',
      'assets/views/b/page-b.phtml'
    ];

    runTest(
      {
        testCase
      },
      done
    );
  });
});
