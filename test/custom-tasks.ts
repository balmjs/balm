import { task, series, parallel } from 'gulp';

function beforeCssTask(cb: Function) {
  console.log('before:task:css');
  cb();
}

function beforeJsTask(cb: Function) {
  console.log('before:task:js');
  cb();
}

task('beforeTask', series(beforeCssTask, beforeJsTask));

function afterCssTask(cb: Function) {
  console.log('after:task:css');
  cb();
}

function afterJsTask(cb: Function) {
  console.log('after:task:js');
  cb();
}

task('afterTask', parallel(afterCssTask, afterJsTask));
