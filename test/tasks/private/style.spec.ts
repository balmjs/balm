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
    const extnames = ['postcss', 'scss', 'sass', 'less'];

    extnames.forEach(function(extname) {
      describe(extname, function() {
        before(function() {
          balm.config = {
            env: {
              isProd: true
            },
            styles: {
              extname: extname === 'postcss' ? 'css' : extname
            }
          };
        });

        it(
          `expected output: "${extname}"`,
          asyncCase(function() {
            expect(styleTask.deps[0]).to.equal(
              extname === 'scss' ? 'sass' : extname
            );
          })
        );
      });
    });
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
