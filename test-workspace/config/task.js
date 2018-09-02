const gulp = require('gulp');

gulp.task('task:before:css', function() {
  console.log('task:before:css');
});

gulp.task('task:before:js', function() {
  console.log('task:before:js');
});

gulp.task('task:before', ['task:before:css', 'task:before:js'], function() {
  console.log('task:before');
});

gulp.task('task:after:css', function() {
  console.log('task:after:css');
});

gulp.task('task:after:js', function() {
  console.log('task:after:js');
});

gulp.task('task:after', ['task:after:css', 'task:after:js'], function() {
  console.log('task:after');
});
