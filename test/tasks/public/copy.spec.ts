import CopyTask from '../../../src/tasks/public/copy';

describe('copy task', function() {
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
    const defaultInput = ['src/foo.txt', 'src/bar.txt'];
    const defaultOutput = 'dist';

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
      const customOptions = {
        dirname: 'a',
        prefix: 'b',
        basename: 'c',
        suffix: 'd',
        extname: 'e'
      };

      it(
        `expected output: "${JSON.stringify(customOptions)}"`,
        asyncCase(function() {
          copyTask.recipe(defaultInput, defaultOutput, {
            renameOptions: customOptions
          })();

          expect(JSON.stringify(copyTask.customOptions)).to.equal(
            JSON.stringify(customOptions)
          );
        })
      );
    });
  });
});
