import MediaTask from '../../../packages/balm-core/src/tasks/private/media';

describe('Media Task', function () {
  let mediaTask: any;

  beforeEach(function () {
    mediaTask = new MediaTask();
    mediaTask.fn();
  });

  describe('development', function () {
    before(function () {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    const defaultOutput = node.path.join(
      balm.config.workspace,
      '.tmp',
      'media'
    );

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function () {
        expect(mediaTask.output).to.equal(defaultOutput);
      })
    );
  });

  describe('production', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    const defaultOutput = node.path.join(
      balm.config.workspace,
      'dist',
      'media'
    );

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function () {
        expect(mediaTask.output).to.equal(defaultOutput);
      })
    );
  });
});
