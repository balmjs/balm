import ReplaceTask from '../../../src/tasks/public/replace';

describe('Replace Task', function() {
  let replaceTask: any;

  beforeEach(function() {
    replaceTask = new ReplaceTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      replaceTask.fn(done);
    });
  });

  describe('#mix.replace()', function() {
    const defaultInput = ['src/compress/file.css', 'src/compress/file.js'];
    const defaultOutput = 'dist';
    const replaceOptions = {
      substr: /bar/gi,
      replacement: 'balm'
    };

    it(
      `expected output: "${JSON.stringify(defaultInput)}"`,
      asyncCase(function() {
        replaceTask.recipe(defaultInput, defaultOutput, replaceOptions)();

        expect(JSON.stringify(replaceTask.input)).to.equal(
          JSON.stringify(defaultInput)
        );
      })
    );
  });
});
