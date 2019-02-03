import { task, series, parallel } from 'gulp';

const beforeCssTask = cb => {
  console.log('before:task:css');
  cb();
};

const beforeJsTask = cb => {
  console.log('before:task:js');
  cb();
};

task('beforeTask', series(beforeCssTask, beforeJsTask));

const afterCssTask = cb => {
  console.log('after:task:css');
  cb();
};

const afterJsTask = cb => {
  console.log('after:task:js');
  cb();
};

task('afterTask', parallel(afterCssTask, afterJsTask));
