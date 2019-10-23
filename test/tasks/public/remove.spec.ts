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

  describe('#mix.remove()', function() {
    describe('input is a string', function() {
      const defaultInput = 'src/foo.txt';

      it(`expected output: "${defaultInput}"`, function(done) {
        removeTask.recipe(defaultInput)(done);

        expect(removeTask.input).to.equal(defaultInput);
      });
    });

    describe('input is an array', function() {
      const defaultInput = ['src/foo.txt', 'src/bar.txt'];

      it(`expected output: "${defaultInput}"`, function(done) {
        removeTask.recipe(defaultInput)(done);

        expect(JSON.stringify(removeTask.input)).to.equal(
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
