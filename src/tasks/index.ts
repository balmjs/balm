import './foundation';
import requireDir from 'require-dir';
import DefaultTask from './default';
import Hooks from '../hooks';

const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.mergeDeep(PRIVATE_TASKS, PUBLIC_TASKS);

  // 1. Register balm tasks
  const depsTasks: any[] = [];
  const nonDepsTasks: any[] = [];
  Object.values(AwesomeTasks).forEach(function(AwesomeTask: any) {
    const awesomeTask = new AwesomeTask.default();
    awesomeTask.deps
      ? depsTasks.push(awesomeTask)
      : nonDepsTasks.push(awesomeTask);
  });

  nonDepsTasks.forEach(function(task: any) {
    const taskName = task.taskName;
    let taskFunction: Function = function(cb: Function): void {
      cb();
    };

    switch (task.name) {
      case 'clean':
      case 'script':
      case 'modernizr':
        taskFunction = function(cb: Function): void {
          task.fn(cb);
        };
        break;
      case 'start':
      case 'end':
      case 'serve':
        taskFunction = function(cb: Function): void {
          task.fn();
          cb();
        };
        break;
      default:
        taskFunction = task.fn;
    }

    gulp.task(taskName, taskFunction);
    BalmJS.tasks.push(task);
  });

  depsTasks.forEach(function(task: any) {
    if (task.deps.length) {
      const taskName = task.taskName;
      const taskFunction: Function = gulp.series(BalmJS.toNamespace(task.deps));

      gulp.task(taskName, taskFunction);
      BalmJS.tasks.push(task);
    }
  });

  // 2. Register balm hooks
  try {
    recipe(new Hooks());
  } catch (error) {
    BalmJS.logger.error('balm hook', error.message);
  }

  // 3. Register balm default task
  const defaultTask = new DefaultTask();
  gulp.task(
    defaultTask.taskName,
    gulp.series(
      ...defaultTask.startTask,
      ...defaultTask.mainTasks,
      ...defaultTask.subTasks,
      ...defaultTask.endTask
    )
  );
}

export default registerTasks;
