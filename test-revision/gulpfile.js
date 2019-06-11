const gulp = require('gulp');
const revAll = require('gulp-rev-all');

gulp.task('default', () => {
  return gulp
    .src('app/**')
    .pipe(revAll.revision())
    .pipe(gulp.dest('dist'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('dist'));
});
