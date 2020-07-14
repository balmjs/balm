import PublishTask from '../../../packages/core/src/tasks/public/publish';

describe('Publish Task', function() {
  let publishTask: any;

  beforeEach(function() {
    publishTask = new PublishTask();
  });

  describe('default', function() {
    it('noop', function(done) {
      publishTask.fn(done);
    });
  });

  describe('#mix.publish()', function() {
    describe('development', function() {
      before(function() {
        balm.config = {
          env: {
            isDev: true
          }
        };
      });

      it('expected output: "`mix.publish()` is only supported for production"', function(done) {
        publishTask.recipe()(done);
      });
    });

    describe('production', function() {
      beforeEach(function() {
        balm.config = {
          env: {
            isProd: true
          }
        };
      });

      it('publish all static assets', function(done) {
        publishTask.recipe()(done);
      });

      it('publish one template', function(done) {
        publishTask.recipe('index.html', 'dist', {
          basename: 'home',
          suffix: '.blade',
          extname: '.php'
        })(done);
      });

      it('publish multiple templates', function(done) {
        publishTask.recipe([
          {
            input: 'page-1.html',
            output: 'dist/page1',
            options: {
              extname: '.php'
            }
          },
          {
            input: 'page-2.html',
            output: 'dist/page2',
            options: {
              extname: '.php'
            }
          }
        ])(done);
      });
    });
  });
});
