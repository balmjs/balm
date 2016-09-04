const tasks = require('require-dir')('../task');

let customTasks = [
  // stylesheets
  'css',
  'less',
  'sass',
  'cssmin',
  // scripts
  'js',
  'jsmin',
  // others
  'copy',
  'remove',
  'zip',
  'ftp',
  // for production
  'publish'
];

function* taskEntries(obj) {
  for (let key of Object.keys(obj)) {
    let SomeTask = obj[key].default;
    yield new SomeTask();
  }
}

for (let task of taskEntries(tasks)) {
  if (customTasks.indexOf(task.name) === -1) {
    gulp.task(task.name, task.deps, task.fn);
  } else {
    let canDo = task.name === 'publish' ?
      config.production :
      true;

    if (canDo) {
      gulp.task(task.name, task.deps, () => {
        return task.fn();
      });

      let mixData = {};
      /**
       * Balm extension
       * @param  {string} input  relative path
       * @param  {string} output relative/absolute path
       */
      BalmJS.mix[task.name] = (input, output, tail = undefined) => {
        mixData = {
          task: task,
          input: input,
          output: output,
          tail: tail
        };
        BalmJS.collections.push(mixData);
      };
    }
  }
}
