import CacheTask from '../../../packages/balm-core/src/tasks/private/cache';

describe('Cache Task', function () {
  let cacheTask: any;

  beforeEach(function () {
    cacheTask = new CacheTask();
    cacheTask.fn();
  });

  describe('in frontend', function () {
    before(function () {
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

    const dist = path.join(balm.config.workspace, 'dist');
    const defaultInput = [
      path.join(dist, 'css', '**', '*'),
      path.join(dist, 'js', '**', '*'),
      path.join(dist, 'img', '**', '*'),
      path.join(dist, 'font', '**', '*'),
      path.join(dist, 'media', '**', '*'),
      '!' + path.join(dist, 'js', 'async', '*'),
      '!' + path.join(dist, 'js', 'assets', '*'),
      '!' + path.join(dist, 'css', 'async', '*'),
      '!' + path.join(dist, 'manifest.json'),
      path.join(dist, '*.html')
    ];
    const defaultOutput = dist;

    it(
      `expected output: ${defaultOutput}`,
      asyncCase(function () {
        expect(JSON.stringify(cacheTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(cacheTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('in backend', function () {
    before(function () {
      balm.config = {
        inFrontend: false,
        env: {
          isProd: true
        },
        scripts: {
          useCache: true
        },
        assets: {
          cache: true,
          includes: ['dist/foo.txt'],
          excludes: ['dist/bar.txt']
        }
      };
    });

    const dist = path.join(balm.config.workspace, 'public');
    const defaultInput = [
      path.join(dist, 'build', 'css', '**', '*'),
      path.join(dist, 'build', 'img', '**', '*'),
      path.join(dist, 'build', 'font', '**', '*'),
      path.join(dist, 'build', 'media', '**', '*'),
      '!' + path.join(dist, 'build', 'js', 'async', '*'),
      '!' + path.join(dist, 'build', 'js', 'assets', '*'),
      '!' + path.join(dist, 'build', 'css', 'async', '*'),
      '!' + path.join(dist, 'manifest.json'),
      path.join(balm.config.workspace, 'dist', 'foo.txt'),
      '!' + path.join(balm.config.workspace, 'dist', 'bar.txt')
    ];
    const defaultOutput = path.join(dist, 'build');

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function () {
        expect(JSON.stringify(cacheTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
        expect(cacheTask.output).to.equal(defaultOutput);
      })
    );
  });
});
