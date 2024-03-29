import CopyTask from '../../../packages/balm-core/src/tasks/public/copy';

describe('Copy Task', function () {
  let copyTask: any;

  beforeEach(function () {
    copyTask = new CopyTask();
  });

  describe('default', function () {
    it('noop', function (done) {
      copyTask.fn(done);
    });
  });

  describe('#mix.copy()', function () {
    const defaultInput = ['src/foo.txt', 'src/bar.txt'];
    const defaultOutput = 'dist';

    describe('!options', function () {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function () {
          copyTask.recipe(defaultInput, defaultOutput)();

          expect(JSON.stringify(copyTask.input)).to.equal(
            JSON.stringify([
              node.path.join(balm.config.workspace, 'src/foo.txt'),
              node.path.join(balm.config.workspace, 'src/bar.txt')
            ])
          );
          expect(copyTask.output).to.equal(
            node.path.join(balm.config.workspace, defaultOutput)
          );
        })
      );
    });

    describe('options', function () {
      const rename = {
        dirname: 'a',
        prefix: 'b',
        basename: 'c',
        suffix: 'd',
        extname: 'e'
      };

      it(
        `expected output: "${JSON.stringify(rename)}"`,
        asyncCase(function () {
          copyTask.recipe(defaultInput, defaultOutput, {
            rename
          })();

          expect(JSON.stringify(copyTask.customOptions)).to.equal(
            JSON.stringify(rename)
          );
        })
      );
    });
  });
});
