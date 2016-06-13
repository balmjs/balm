class Task {
  constructor() {
    const tasks = require('require-dir')('./task');

    for (let name in tasks) {
      let task = tasks[name].default;
      let t = new task();
      gulp.task(t.name, t.deps, t.fn);
    }

    if (config.production) {
      gulp.task('default', ['clean'], () => {
        gulp.start('build');
      });
    } else {
      gulp.task('default', ['serve']);
    }
  }
}

export default Task;
