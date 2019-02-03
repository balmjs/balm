import assert from 'assert';
import EndTask from '../../../lib/tasks/private/end';

describe('End Task', () => {
  before(function() {
    balm.afterTask = () => {
      assert.ok(true);
    };
  });

  it('after task', done => {
    const task = new EndTask();

    gulp.series(task.fn)();
    done();
  });
});
