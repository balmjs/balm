import RemoveTask from '../../../packages/balm-core/src/tasks/public/remove';

describe('Remove Task', function() {
  let removeTask: any;

  beforeEach(function() {
    removeTask = new RemoveTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      removeTask.fn(done);
    });
  });

  describe('#mix.remove()', function() {
    describe('input is a string', function() {
      const file = 'src/foo.txt';
      const defaultInput = path.join(balm.config.workspace, file);

      it(`expected output: "${defaultInput}"`, function(done) {
        removeTask.recipe(defaultInput)(done);

        expect(removeTask.getFiles(file)).to.equal(defaultInput);
      });
    });

    describe('input is an array', function() {
      const files = ['src/foo.txt', 'src/bar.txt'];
      const defaultInput = [
        path.join(balm.config.workspace, files[0]),
        path.join(balm.config.workspace, files[1])
      ];

      it(`expected output: "${defaultInput}"`, function(done) {
        removeTask.recipe(defaultInput)(done);

        expect(JSON.stringify(removeTask.getFiles(files))).to.equal(
          JSON.stringify(defaultInput)
        );
      });
    });

    describe('input is an object', function() {
      const defaultInput = {};

      it(`expected output: "Invalid input"`, function(done) {
        removeTask.recipe(defaultInput)(done);
      });
    });
  });
});
