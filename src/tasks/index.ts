import './foundation';
import requireDir from 'require-dir';
import DefaultTask from './default';
import Hooks from '../hooks';

const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

function registerTasks(recipe: Function): void {
  const AwesomeTasks = BalmJS.utils.mergeDeep(PRIVATE_TASKS, PUBLIC_TASKS);

  Object.values(AwesomeTasks).forEach((AwesomeTask: any) => {
    const awesomeTask = new AwesomeTask();

    const taskFn =
      awesomeTask.name === 'sprite' && BalmJS.config.images.sprites.length
        ? gulp.series(awesomeTask.deps)
        : awesomeTask.fn;

    gulp.task(awesomeTask.taskName, taskFn);
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
