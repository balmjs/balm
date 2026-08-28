import PublishTask from '../../../packages/balm-core/src/tasks/public/publish';

describe('Publish Task', function () {
  let publishTask: any;

  beforeEach(function () {
    publishTask = new PublishTask();
  });

  describe('default', function () {
    it('noop', function (done) {
      publishTask.fn(done);
    });
  });

  describe('#mix.publish()', function () {
    describe('development', function () {
      before(function () {
        balm.config = {
          env: {
            isDev: true
          }
        };
      });

      it('expected output: "`mix.publish()` is only supported for production"', function (done) {
        publishTask.recipe()(done);
      });
    });

    describe('production', function () {
      beforeEach(function () {
        balm.config = {
          env: {
            isProd: true
          }
        };
      });

      it(
        'publish all static assets',
        asyncCase(function () {
          publishTask.init();
          expect(publishTask.output).to.equal(BalmJS.config.assets.static);
        })
      );

      it(
        'publish one template',
        asyncCase(function () {
          publishTask.init(
            node.path.join(BalmJS.config.dest.base, 'default.html'),
            node.path.join(BalmJS.config.assets.root, 'dist')
          );
          expect(publishTask.output).to.equal(
            node.path.join(BalmJS.config.assets.root, 'dist')
          );
        })
      );

      it(
        'publish multiple templates',
        asyncCase(function () {
          const fn = publishTask.recipe([
            {
              input: 'page-a.html',
              output: 'dist/page1',
              options: {
                extname: '.php'
              }
            },
            {
              input: 'page-b.html',
              output: 'dist/page2',
              options: {
                extname: '.php'
              }
            }
          ]);
          expect(typeof fn).to.equal('function');
        })
      );
    });
  });
});
