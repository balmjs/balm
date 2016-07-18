import { customTask } from './helper';

class Task {
  constructor() {
    const tasks = require('require-dir')('./task');

    function* entries(obj) {
      for (let key of Object.keys(obj)) {
        if (key !== 'task') {
          yield new obj[key].default;
        }
      }
    }

    // gulp builder
    for (let task of entries(tasks)) {
      if (task.name === 'webpack') {
        gulp.task(task.name, task.deps, task.fn);
      } else {
        gulp.task(task.name, task.deps, () => {
          return task.fn();
        });
        // balm extension
        mix[task.name] = (input, output) => {
          collections.push({
            task: task,
            input: input,
            output: output
          });
        };
      }
    }

    if (config.useDefault) {
      if (!config.production) {
        gulp.task('default', ['serve'], () => {
          customTask();
        });
      } else {
        gulp.task('default', ['clean'], () => {
          customTask(config.cache ? 'version' : 'build');
        });
      }
    } else {
      gulp.task('default', () => {
        customTask();
      });
    }

    if (config.debug) {
      console.info('Gulp task:')
      console.log(gulp.tasks);
      console.log('\n');
    }
  }
}

export default Task;
