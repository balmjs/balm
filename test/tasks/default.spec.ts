import DefaultTask from '../../src/tasks/default';
import balm from '../../src';

describe('default task', function() {
  let defaultTask: any;

  beforeEach(function() {
    defaultTask = new DefaultTask();
  });

  describe('start task', function() {
    const beforeTask = 'beforeTask';
    const startTask = 'balm:start';

    describe('without before task', function() {
      it(
        `tasks[0] expected output: "${startTask}"`,
        asyncCase(function() {
          const tasks = defaultTask.startTask;

          expect(tasks[0]).to.equal(startTask);
        })
      );
    });

    describe('with before task', function() {
      before(function() {
        balm.beforeTask = beforeTask;
      });

      it(
        `tasks[0] expected output: "${beforeTask}"`,
        asyncCase(function() {
          const tasks = defaultTask.startTask;

          expect(tasks[0]).to.equal(beforeTask);
          expect(tasks[1]).to.equal(startTask);
        })
      );
    });
  });

  describe('main tasks', function() {
    describe('in Prod', function() {
      const mainTasks = [
        'balm:clean',
        'balm:style',
        'balm:script',
        'balm:html',
        'balm:image',
        'balm:font',
        'balm:media',
        'balm:extra',
        'balm:build'
      ];

      before(function() {
        balm.config = {
          env: {
            isProd: true,
            isDev: false
          }
        };
      });

      it(
        `tasks length expected output: ${mainTasks.length}`,
        asyncCase(function() {
          const tasks = defaultTask.mainTasks;

          expect(JSON.stringify(tasks)).to.equal(JSON.stringify(mainTasks));
        })
      );
    });

    describe('with sprites, eslint, cache and pwa in Prod ', function() {
      const mainTasks = [
        'balm:clean',
        'balm:sprite',
        'balm:style',
        'balm:lint',
        'balm:script',
        'balm:html',
        'balm:image',
        'balm:font',
        'balm:media',
        'balm:extra',
        'balm:build',
        'balm:cache',
        'balm:workbox-sw',
        'balm:pwa'
      ];

      before(function() {
        balm.config = {
          env: {
            isProd: true,
            isDev: false
          },
          styles: {
            sprites: ['img-icon']
          },
          scripts: {
            eslint: true
          },
          assets: {
            cache: true
          },
          pwa: {
            enabled: true
          }
        };
      });

      it(
        `tasks length expected output: ${mainTasks.length}`,
        asyncCase(function() {
          const tasks = defaultTask.mainTasks;

          expect(JSON.stringify(tasks)).to.equal(JSON.stringify(mainTasks));
        })
      );
    });

    describe('use defaults in Dev', function() {
      const mainTasks = [
        'balm:clean',
        'balm:sprite',
        'balm:style',
        'balm:lint',
        'balm:script',
        'balm:html',
        'balm:modernizr',
        'balm:font',
        'balm:serve'
      ];

      before(function() {
        balm.config = {
          env: {
            isProd: false,
            isDev: true
          }
        };
      });

      it(
        `tasks length expected output: ${mainTasks.length}`,
        asyncCase(function() {
          const tasks = defaultTask.mainTasks;

          expect(JSON.stringify(tasks)).to.equal(JSON.stringify(mainTasks));
        })
      );
    });

    describe('do not use defaults in Dev', function() {
      before(function() {
        balm.config = {
          env: {
            isProd: false,
            isDev: true
          },
          useDefaults: false
        };
      });

      it(
        'tasks length expected output: 0',
        asyncCase(function() {
          const tasks = defaultTask.mainTasks;

          expect(tasks.length).to.equal(0);
        })
      );
    });
  });

  describe('sub tasks', function() {
    describe('without mix', function() {
      it(
        'tasks length expected output: 0',
        asyncCase(function() {
          const tasks = defaultTask.subTasks;

          expect(tasks.length).to.equal(0);
        })
      );
    });

    describe('with mix', function() {
      const subTasks = ['balm:postcss:0', 'balm:script:1'];

      before(function() {
        balm.go((mix: any) => {
          mix.css('main.css', 'dist/css');
          mix.js('main.js', 'dist/js');
        });
      });

      it(
        'tasks length expected output: 2',
        asyncCase(function() {
          const tasks = defaultTask.subTasks;

          expect(JSON.stringify(tasks)).to.equal(JSON.stringify(subTasks));
        })
      );
    });
  });

  describe('end task', function() {
    const afterTask = 'afterTask';
    const endTask = 'balm:end';

    describe('without after task', function() {
      it(
        `tasks[0] expected output: "${endTask}"`,
        asyncCase(function() {
          const tasks = defaultTask.endTask;

          expect(tasks[0]).to.equal(endTask);
        })
      );
    });

    describe('with after task', function() {
      before(function() {
        balm.afterTask = afterTask;
      });

      it(
        `tasks[1] expected output: "${afterTask}"`,
        asyncCase(function() {
          const tasks = defaultTask.endTask;

          expect(tasks[0]).to.equal(endTask);
          expect(tasks[1]).to.equal(afterTask);
        })
      );
    });
  });
});
