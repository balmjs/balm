const gulp = require('gulp');

const beforeCssTask = cb => {
  console.log('before:task:css');
  cb();
};

const beforeJsTask = cb => {
  console.log('before:task:js');
  cb();
};

gulp.task('beforeTask', gulp.series(beforeCssTask, beforeJsTask));

const afterCssTask = cb => {
  console.log('after:task:css');
  cb();
};

const afterJsTask = cb => {
  console.log('after:task:js');
  cb();
};

gulp.task('afterTask', gulp.parallel(afterCssTask, afterJsTask));
