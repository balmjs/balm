import gulp from 'gulp';

gulp.task('task:before:css', () => {
  console.log('task:before:css');
});

gulp.task('task:before:js', () => {
  console.log('task:before:js');
});

gulp.task('task:before', ['task:before:css', 'task:before:js'], () => {
  console.log('task:before');
});

gulp.task('task:after:css', () => {
  console.log('task:after:css');
});

gulp.task('task:after:js', () => {
  console.log('task:after:js');
});

gulp.task('task:after', ['task:after:css', 'task:after:js'], () => {
  console.log('task:after');
});
