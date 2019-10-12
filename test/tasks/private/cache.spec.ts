import CacheTask from '../../../src/tasks/private/cache';

describe('cache task', function() {
  let cacheTask: any;

  beforeEach(function() {
    cacheTask = new CacheTask();
    cacheTask.fn();
  });

  describe('in frontend', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true,
          isDev: false
        },
        inFrontend: true
      };
    });

    const defaultInput = [
      'dist/css/**/*',
      'dist/js/**/*',
      'dist/img/**/*',
      'dist/font/**/*',
      'dist/media/**/*',
      '!dist/manifest.json',
      '!dist/js/async/*',
      '!dist/js/assets/*',
      'dist/*.html'
    ];
    const defaultOutput = 'dist';

    it(
      `expected output: ${defaultOutput}`,
      asyncCase(function() {
        expect(JSON.stringify(cacheTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(cacheTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('in backend', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true,
          isDev: false
        },
        scripts: {
          inject: true
        },
        assets: {
          includes: ['dist/foo.txt'],
          excludes: ['dist/bar.txt']
        },
        inFrontend: false
      };
    });

    const defaultInput = [
      'public/css/**/*',
      'public/img/**/*',
      'public/font/**/*',
      'public/media/**/*',
      '!public/manifest.json',
      '!public/js/async/*',
      '!public/js/assets/*',
      `${balm.config.workspace}/dist/foo.txt`,
      `!${balm.config.workspace}/dist/bar.txt`
    ];
    const defaultOutput = 'public';

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(JSON.stringify(cacheTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(cacheTask.output).to.equal(defaultOutput);
      })
    );
  });
});
