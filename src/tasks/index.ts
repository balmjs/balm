import './foundation';
import requireDir from 'require-dir';
import DefaultTask from './default';
import Hooks from '../hooks';

const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.mergeDeep(PRIVATE_TASKS, PUBLIC_TASKS);

  // Register balm tasks
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
      case 'watch':
      case 'copy':
      case 'remove':
      case 'zip':
      case 'ftp':
      case 'publish':
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

  // Register balm hooks
  const hooks: any = new Hooks();
  recipe(hooks);

  // Register balm watch tasks
  // for (const key in hooks) {
  //   if (
  //     BalmJS.utils.isFunction(hooks[key]) &&
  //     key !== 'constructor' &&
  //     key !== 'watch'
  //   ) {
  //     const customTask = BalmJS.tasks.find((task: any) =>
  //       key === 'js' ? task.name === 'script' : task.name === key
  //     );
  //     let taskFunction: Function = function(cb: Function): void {
  //       cb();
  //     };

  //     switch (customTask.name) {
  //       case 'script':
  //       case 'remove':
  //         taskFunction = function(cb: Function): void {
  //           customTask.recipe(cb);
  //         };
  //         break;
  //       default:
  //         taskFunction = function(cb: Function): void {
  //           customTask.recipe();
  //           cb();
  //         };
  //     }

  //     gulp.task(BalmJS.toNamespace(`watch:${customTask.name}`), taskFunction);
  //   }
  // }

  // Register balm default task
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
