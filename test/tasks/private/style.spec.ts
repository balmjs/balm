import StyleTask from '../../../src/tasks/private/style';

describe('style task', function() {
  let styleTask: any;

  beforeEach(function() {
    styleTask = new StyleTask();
  });

  describe('development', function() {
    before(function() {
      balm.config = {
        env: {
          isDev: true
        }
      };
    });

    it(
      `deps length expected output: 1`,
      asyncCase(function() {
        expect(styleTask.deps.length).to.equal(1);
      })
    );
  });

  describe('production', function() {
    before(function() {
      balm.config = {
        env: {
          isProd: true
        }
      };
    });

    it(
      `deps length expected output: 2`,
      asyncCase(function() {
        expect(styleTask.deps.length).to.equal(2);
      })
    );
  });

  describe('in backend', function() {
    before(function() {
      balm.config = {
        inFrontend: false
      };
    });

    it(
      `deps length expected output: 2`,
      asyncCase(function() {
        expect(styleTask.deps.length).to.equal(2);
      })
    );
  });
});
