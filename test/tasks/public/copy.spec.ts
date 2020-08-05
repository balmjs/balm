import CopyTask from '../../../packages/balm-core/src/tasks/public/copy';

describe('Copy Task', function() {
  let copyTask: any;

  beforeEach(function() {
    copyTask = new CopyTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      copyTask.fn(done);
    });
  });

  describe('#mix.copy()', function() {
    const defaultInput = [
      path.join(balm.config.workspace, 'src/foo.txt'),
      path.join(balm.config.workspace, 'src/bar.txt')
    ];
    const defaultOutput = path.join(balm.config.workspace, 'dist');

    describe('!options', function() {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function() {
          copyTask.recipe(defaultInput, defaultOutput)();

          expect(JSON.stringify(copyTask.input)).to.equal(
            JSON.stringify(defaultInput)
          );
          expect(copyTask.output).to.equal(defaultOutput);
        })
      );
    });

    describe('options', function() {
      const rename = {
        dirname: 'a',
        prefix: 'b',
        basename: 'c',
        suffix: 'd',
        extname: 'e'
      };

      it(
        `expected output: "${JSON.stringify(rename)}"`,
        asyncCase(function() {
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
