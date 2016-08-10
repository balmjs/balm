import {
  customTask
} from './helper';

class Tasks {
  constructor() {
    const tasks = require('require-dir')('./task');

    function* entries(obj) {
      for (let key of Object.keys(obj)) {
        if (key !== 'task') {
          let SomeTask = obj[key].default;
          yield new SomeTask();
        }
      }
    }

    // gulp builder
    let customTasks = [
      // stylesheets
      'css',
      'sass',
      'less',
      'cssmin',
      // scripts
      'js',
      'jsmin',
      // others
      'publish',
      'copy',
      // 'version',
      'zip',
      'ftp'
    ];
    for (let task of entries(tasks)) {
      if (customTasks.indexOf(task.name) === -1) {
        gulp.task(task.name, task.deps, task.fn);
      } else {
        gulp.task(task.name, task.deps, () => {
          return task.fn();
        });
        /**
         * Balm extension
         * @param  {string} input  relative path
         * @param  {string} output relative/absolute path
         */
        mix[task.name] = (input, output, tail = undefined) => {
          collections.push({
            task: task,
            input: input,
            output: output,
            tail: tail
          });
        };
      }
    }

    if (config.useDefault) {
      if (config.production) {
        gulp.task('default', ['clean'], () => {
          customTask(config.cache.enabled ? 'version' : 'build');
        });
      } else {
        let task = new Task();
        let beforeServeTasks = task.getSpriteTasks(true);
        if (beforeServeTasks.length) {
          gulp.task('default', beforeServeTasks, () => {
            customTask('serve');
          });
        } else {
          gulp.task('default', ['serve'], () => {
            customTask();
          });
        }
      }
    } else {
      gulp.task('default', () => {
        customTask();
      });
    }

    if (config.debug) {
      $.util.log($.util.colors.red('Gulp task:'), RN, gulp.tasks, RN);
    }
  }
}

export default Tasks;
