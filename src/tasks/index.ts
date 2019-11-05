import './foundation';
import requireDir from 'require-dir';
import DefaultTask from './default';
import Hooks from '../hooks';

const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.deepMerge(PRIVATE_TASKS, PUBLIC_TASKS);

  // 1. Register balm tasks
  const depsTasks: any[] = [];
  const nonDepsTasks: any[] = [];
  Object.values(AwesomeTasks).forEach(function(AwesomeTask: any) {
    const awesomeTask: any = new AwesomeTask.default();
    awesomeTask.deps
      ? depsTasks.push(awesomeTask)
      : nonDepsTasks.push(awesomeTask);
  });

  nonDepsTasks.forEach(function(task: any) {
    const taskName: string = task.taskName;
    const taskFunction: Function = task.fn;

    gulp.task(taskName, taskFunction);
    BalmJS.tasks.push(task);
  });

  depsTasks.forEach(function(task: any) {
    const taskName: string = task.taskName;
    const taskFunction: Function = task.deps.length
      ? gulp.series(BalmJS.toNamespace(task.deps))
      : function(cb: Function): void {
          cb();
        };

    gulp.task(taskName, taskFunction);
    BalmJS.tasks.push(task);
  });

  // 2. Register balm hooks
  try {
    recipe(new Hooks());
  } catch (error) {
    BalmJS.logger.error('balm hook', error.message);
  }

  // 3. Register balm default task
  const defaultTask: any = new DefaultTask();
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
