import ExtraTask from '../../../packages/balm-core/src/tasks/private/extra';

describe('Extra Task', function () {
  let extraTask: any;

  const srcBase = node.path.join(balm.config.workspace, 'src');

  describe('without extra input', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true
        }
      };

      extraTask = new ExtraTask();
      extraTask.fn();
    });

    const defaultInput = [
      node.path.join(srcBase, '*.*'),
      '!' + node.path.join(srcBase, '*.html'),
      '!' + node.path.join(srcBase, 'manifest.json')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        expect(JSON.stringify(extraTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });

  describe('with extra input', function () {
    before(function () {
      balm.config = {
        env: {
          isProd: true
        },
        extras: {
          includes: ['foo.txt'],
          excludes: ['bar.txt']
        }
      };

      extraTask = new ExtraTask();
      extraTask.fn();
    });

    const defaultInput = [
      node.path.join(srcBase, '*.*'),
      '!' + node.path.join(srcBase, '*.html'),
      '!' + node.path.join(srcBase, 'manifest.json'),
      node.path.join(srcBase, 'foo.txt'),
      '!' + node.path.join(srcBase, 'bar.txt')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function () {
        expect(JSON.stringify(extraTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });
});
