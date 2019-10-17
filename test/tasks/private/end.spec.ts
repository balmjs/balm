import EndTask from '../../../src/tasks/private/end';

describe('end task', function() {
  let endTask: any;

  describe('!after task', function() {
    before(function() {
      endTask = new EndTask();
      console.time('BalmJS Time');
      endTask.fn(function() {});
    });

    it(
      `expected output: "undefined"`,
      asyncCase(function() {
        expect(typeof BalmJS.afterTask).to.equal('undefined');
      })
    );
  });

  describe('after task', function() {
    before(function() {
      balm.afterTask = function() {
        console.log('gg');
      };

      endTask = new EndTask();
      console.time('BalmJS Time');
      endTask.fn(function() {});
    });

    it(
      `expected output: "function"`,
      asyncCase(function() {
        expect(typeof BalmJS.afterTask).to.equal('function');
      })
    );
  });
});
