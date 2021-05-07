import './foundation/index.js';
import PRIVATE_TASKS from './private/index.js';
import PUBLIC_TASKS from './public/index.js';
import DefaultTask from './default.js';
import BalmHooks from '../hooks/index.js';

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.deepMerge(PRIVATE_TASKS, PUBLIC_TASKS);

  // 1. Register balm tasks
  const depsTasks: any[] = [];
  const nonDepsTasks: any[] = [];
  Object.values(AwesomeTasks).forEach((AwesomeTask: any) => {
    const awesomeTask: any = new AwesomeTask();
    awesomeTask.deps
      ? depsTasks.push(awesomeTask)
      : nonDepsTasks.push(awesomeTask);
  });

  nonDepsTasks.forEach((task: any) => {
    const taskName: string = task.taskName;
    const taskFunction: Function = task.fn;

    gulp.task(taskName, taskFunction);
    BalmJS.tasks.set(task.name, task);
  });

  depsTasks.forEach((task: any) => {
    const taskName: string = task.taskName;
    const taskFunction: Function = task.deps.length
      ? gulp.series(...BalmJS.toNamespace(task.deps))
      : (callback: Function): void => {
          callback();
        };

    gulp.task(taskName, taskFunction);
    BalmJS.tasks.set(task.name, task);
  });

  // 2. Register balm hooks
  try {
    recipe(new BalmHooks());
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

  // 4. Run
  gulp.parallel('balm:default')();
}

export default registerTasks;
