import ExtraTask from '../../../packages/balm-core/src/tasks/private/extra';

describe('Extra Task', function() {
  let extraTask: any;

  const srcBase = 'src';

  describe('without extra input', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };

      extraTask = new ExtraTask();
      extraTask.fn();
    });

    const defaultInput = [
      path.join(srcBase, '*.*'),
      '!' + path.join(srcBase, '*.html'),
      '!' + path.join(srcBase, 'manifest.json')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        expect(JSON.stringify(extraTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });

  describe('with extra input', function() {
    before(function() {
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
      path.join(srcBase, '*.*'),
      '!' + path.join(srcBase, '*.html'),
      '!' + path.join(srcBase, 'manifest.json'),
      path.join(srcBase, 'foo.txt'),
      '!' + path.join(srcBase, 'bar.txt')
    ];

    it(
      `expected output: "${defaultInput}"`,
      asyncCase(function() {
        expect(JSON.stringify(extraTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });
});
