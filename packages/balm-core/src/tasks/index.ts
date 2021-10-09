import './foundation';
import requireDir from 'require-dir';
import DefaultTask from './default';
import BalmHooks from '../hooks';
import { BalmError } from '@balm-core/index';

const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.deepMerge(PRIVATE_TASKS, PUBLIC_TASKS);

  // 1. Register balm tasks
  const depsTasks: any[] = [];
  const nonDepsTasks: any[] = [];
  Object.values(AwesomeTasks).forEach((AwesomeTask: any) => {
    const awesomeTask: any = new AwesomeTask.default();
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
    const { message } = error as BalmError;
    BalmJS.logger.error('balm hook', message);
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
