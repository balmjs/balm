import StartTask from '../../../packages/balm-core/src/tasks/private/start';

describe('Start Task', function () {
  let startTask: any;

  describe('!before task', function () {
    before(function (done) {
      startTask = new StartTask();
      startTask.fn(done);
    });

    it(
      `expected output: "undefined"`,
      asyncCase(function () {
        expect(typeof BalmJS.beforeTask).to.equal('undefined');
      })
    );
  });

  describe('before task', function () {
    before(function (done) {
      balm.beforeTask = function () {
        console.log('Hello BalmJS');
      };

      startTask = new StartTask();
      startTask.fn(done);
    });

    it(
      `expected output: "function"`,
      asyncCase(function () {
        expect(typeof BalmJS.beforeTask).to.equal('function');
      })
    );
  });
});
