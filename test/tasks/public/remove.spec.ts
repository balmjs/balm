import RemoveTask from '../../../src/tasks/public/remove';

describe('remove task', function() {
  let removeTask: any;

  beforeEach(function() {
    removeTask = new RemoveTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      removeTask.fn(done);
    });
  });

  describe('#mix.copy()', function() {
    const defaultInput = ['src/foo.txt', 'src/bar.txt'];
    const defaultOutput = 'dist';

    describe('!options', function() {
      it(
        `expected output: "${defaultInput}"`,
        asyncCase(function() {
          removeTask.recipe(defaultInput, defaultOutput)();

          expect(JSON.stringify(removeTask.input)).to.equal(
            JSON.stringify(defaultInput)
          );
          expect(removeTask.output).to.equal(defaultOutput);
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
          removeTask.recipe(defaultInput, defaultOutput, {
            renameOptions: customOptions
          })();

          expect(JSON.stringify(removeTask.customOptions)).to.equal(
            JSON.stringify(customOptions)
          );
        })
      );
    });
  });
});
