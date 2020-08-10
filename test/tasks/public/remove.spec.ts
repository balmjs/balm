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
      const defaultInput = 'src/foo.txt';
      // const defaultOutput = path.join(balm.config.workspace, defaultInput);

      it(`expected output: "${defaultInput}"`, function(done) {
        removeTask.recipe(defaultInput)(done);
      });
    });

    describe('input is an array', function() {
      const defaultInput = ['src/foo.txt', 'src/bar.txt'];
      // const defaultOutput = [
      //   path.join(balm.config.workspace, defaultInput[0]),
      //   path.join(balm.config.workspace, defaultInput[1])
      // ];

      it(`expected output: "${defaultInput}"`, function(done) {
        removeTask.recipe(defaultInput)(done);
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
