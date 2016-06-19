import { customTask } from './helper';

class Task {
  constructor() {
    const tasks = require('require-dir')('./task');

    // gulp builder
    for (let name in tasks) {
      let taskClass = tasks[name].default;
      let task = new taskClass();
      gulp.task(task.name, task.deps, () => {
        return task.fn();
      });
      // balm extension
      mix[task.name] = (input = '', output = '') => {
        collections.push({
          task: task,
          input: input,
          output: output
        });
      };
    }

    if (config.useDefault) {
      if (config.production) {
        gulp.task('default', ['clean'], () => {
          gulp.start('build');
          customTask();
        });
      } else {
        gulp.task('default', ['serve'], () => {
          customTask();
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
