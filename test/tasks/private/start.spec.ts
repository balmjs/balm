import StartTask from '../../../src/tasks/private/start';

describe('start task', function() {
  let startTask: any;

  describe('!before task', function() {
    before(function(done) {
      startTask = new StartTask();
      startTask.fn(function() {
        console.timeEnd('BalmJS Time');
        done();
      });
    });

    it(
      `expected output: "undefined"`,
      asyncCase(function() {
        expect(typeof BalmJS.beforeTask).to.equal('undefined');
      })
    );
  });

  describe('before task', function() {
    before(function(done) {
      balm.beforeTask = function() {
        console.log('Hello BalmJS');
        done();
      };

      startTask = new StartTask();
      startTask.fn(function() {
        console.timeEnd('BalmJS Time');
      });
    });

    it(
      `expected output: "function"`,
      asyncCase(function() {
        expect(typeof BalmJS.beforeTask).to.equal('function');
      })
    );
  });
});
