import RollupTask from '../../../packages/balm-core/src/tasks/public/rollup';

describe('Rollup Task', function () {
  let rollupTask: any;

  beforeEach(function () {
    rollupTask = new RollupTask();
  });

  describe('default', function () {
    it('noop', function (done) {
      rollupTask.fn(done);
    });
  });
});
