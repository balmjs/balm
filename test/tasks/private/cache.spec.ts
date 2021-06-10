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
      BalmJS.config.scripts.useCache = true;
    });

    after(function () {
      BalmJS.config.scripts.useCache = false;
    });

    const dist = node.path.join(balm.config.workspace, 'dist');
    const defaultInput = [
      node.path.join(dist, 'css', '**', '*'),
      // node.path.join(dist, 'js', '**', '*'),
      node.path.join(dist, 'img', '**', '*'),
      node.path.join(dist, 'font', '**', '*'),
      node.path.join(dist, 'media', '**', '*'),
      '!' + node.path.join(dist, 'js', 'async', '*'),
      '!' + node.path.join(dist, 'js', 'assets', '*'),
      '!' + node.path.join(dist, 'css', 'async', '*'),
      '!' + node.path.join(dist, 'manifest.json'),
      node.path.join(dist, '*.html')
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
        assets: {
          cache: true,
          includes: ['dist/foo.txt'],
          excludes: ['dist/bar.txt']
        }
      };
    });

    const dist = node.path.join(balm.config.workspace, 'public');
    const defaultInput = [
      node.path.join(dist, 'build', 'css', '**', '*'),
      node.path.join(dist, 'build', 'js', '**', '*'),
      node.path.join(dist, 'build', 'img', '**', '*'),
      node.path.join(dist, 'build', 'font', '**', '*'),
      node.path.join(dist, 'build', 'media', '**', '*'),
      '!' + node.path.join(dist, 'build', 'js', 'async', '*'),
      '!' + node.path.join(dist, 'build', 'js', 'assets', '*'),
      '!' + node.path.join(dist, 'build', 'css', 'async', '*'),
      '!' + node.path.join(dist, 'manifest.json'),
      node.path.join(balm.config.workspace, 'dist', 'foo.txt'),
      '!' + node.path.join(balm.config.workspace, 'dist', 'bar.txt')
    ];
    const defaultOutput = node.path.join(dist, 'build');

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
