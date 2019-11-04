import { cleanup, runTest } from './test';

describe('App Test in production', function() {
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

  it('expected output: "dist"', function(done) {
    runTest(
      {
        testCase
      },
      {
        done,
        delay: 4000
      }
    );
  });
});
