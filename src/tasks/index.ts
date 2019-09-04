import './task';
import requireDir from 'require-dir';
// import DefaultTask from './default';

// const PRIVATE_TASKS = requireDir('./private');
const PUBLIC_TASKS = requireDir('./public');

Object.values(PUBLIC_TASKS).forEach((AwesomeTask: any) => {
  const awesomeTask = new AwesomeTask();
  gulp.task(awesomeTask.taskName, awesomeTask.fn);
});

// const defaultTask = new DefaultTask();
// gulp.task(defaultTask.taskName, defaultTask.fn);
