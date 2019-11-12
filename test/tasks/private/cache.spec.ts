import CacheTask from '../../../src/tasks/private/cache';

describe('Cache Task', function() {
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
      path.join('dist', 'css', '**', '*'),
      path.join('dist', 'js', '**', '*'),
      path.join('dist', 'img', '**', '*'),
      path.join('dist', 'font', '**', '*'),
      path.join('dist', 'media', '**', '*'),
      '!' + path.join('dist', 'manifest.json'),
      '!' + path.join('dist', 'js', 'async', '*'),
      '!' + path.join('dist', 'js', 'assets', '*'),
      path.join('dist', '*.html')
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
      path.join('public', 'build', 'css', '**', '*'),
      path.join('public', 'build', 'img', '**', '*'),
      path.join('public', 'build', 'font', '**', '*'),
      path.join('public', 'build', 'media', '**', '*'),
      '!' + path.join('public', 'manifest.json'),
      '!' + path.join('public', 'build', 'js', 'async', '*'),
      '!' + path.join('public', 'build', 'js', 'assets', '*'),
      'dist/foo.txt',
      '!dist/bar.txt'
    ];
    const defaultOutput = path.join('public', 'build');

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
