import EndTask from '../../../packages/balm-core/src/tasks/private/end';

describe('End Task', function () {
  let endTask: any;

  describe('!after task', function () {
    before(function (done) {
      endTask = new EndTask();
      endTask.fn(done);
    });

    it(
      `expected output: "undefined"`,
      asyncCase(function () {
        expect(typeof BalmJS.afterTask).to.equal('undefined');
      })
    );
  });

  describe('after task', function () {
    before(function (done) {
      balm.afterTask = function () {
        console.log('THX BalmJS');
      };

      endTask = new EndTask();
      endTask.fn(done);
    });

    it(
      `expected output: "function"`,
      asyncCase(function () {
        expect(typeof BalmJS.afterTask).to.equal('function');
      })
    );
  });
});
