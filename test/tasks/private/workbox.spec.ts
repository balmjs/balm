import WorkboxTask from '../../../src/tasks/private/workbox-sw';

describe('workbox task', function() {
  let workboxTask: any;

  beforeEach(function() {
    workboxTask = new WorkboxTask();
    workboxTask.fn();
  });

  describe('workbox-sw', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    const defaultOutput = 'dist';

    it(
      `expected output: "${defaultOutput}"`,
      asyncCase(function() {
        expect(workboxTask.output).to.equal(defaultOutput);
      })
    );
  });
});
