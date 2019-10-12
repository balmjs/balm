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
        inFrontend: true,
        env: {
          isProd: true
        },
        assets: {
          cache: true
        }
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

  // TODO: WTF?
  describe('in backend', function() {
    before(function() {
      balm.config = {
        inFrontend: false,
        env: {
          isProd: true
        },
        scripts: {
          inject: true
        },
        assets: {
          cache: true,
          includes: ['dist/foo.txt'],
          excludes: ['dist/bar.txt']
        }
      };
    });

    const defaultInput = [
      'public/build/css/**/*',
      'public/build/img/**/*',
      'public/build/font/**/*',
      'public/build/media/**/*',
      '!public/manifest.json',
      '!public/build/js/async/*',
      '!public/build/js/assets/*',
      `${balm.config.workspace}/dist/foo.txt`,
      `!${balm.config.workspace}/dist/bar.txt`
    ];
    const defaultOutput = 'public/build';

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
