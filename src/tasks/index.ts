import './foundation';
import requireDir from 'require-dir';
import DefaultTask from './default';
import Hooks from '../hooks';

const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.mergeDeep(PRIVATE_TASKS, PUBLIC_TASKS);

  // Register balm task
  Object.values(AwesomeTasks).forEach(function(AwesomeTask: any) {
    const awesomeTask = new AwesomeTask();
    const taskName = awesomeTask.taskName;
    let taskFunction: Function = function(cb: Function): void {
      cb();
    };

    switch (awesomeTask.name) {
      case 'sprite':
        if (BalmJS.config.styles.sprites.length) {
          taskFunction = gulp.series(awesomeTask.deps);
        }
        break;
      case 'clean':
      case 'script':
      case 'modernizr':
        taskFunction = function(cb: Function): void {
          awesomeTask.fn(cb);
        };
        break;
      case 'copy':
      case 'remove':
        taskFunction = awesomeTask.fn;
        break;
      default:
        taskFunction = function(cb: Function): void {
          awesomeTask.fn();
          cb();
        };
    }

    gulp.task(taskName, taskFunction);
    BalmJS.tasks.push(awesomeTask);
  });

  recipe(new Hooks());

  const defaultTask = new DefaultTask();
  gulp.task(
    defaultTask.taskName,
    gulp.series(
      ...defaultTask.startTask,
      ...defaultTask.mainTasks,
      ...defaultTask.subTasks,
      ...defaultTask.endTask
      // defaultTask.fn
    )
  );
}

export default registerTasks;
