import assert from 'assert';
import StartTask from '../../../lib/tasks/private/start';

describe('Start Task', () => {
  before(function() {
    balm.beforeTask = () => {
      assert.ok(true);
    };
  });

  it('before task', () => {
    const task = new StartTask();

    gulp.series(task.fn)();
  });
});
