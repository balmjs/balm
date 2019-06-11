const gulp = require('gulp');
const revAll = require('gulp-rev-all');

gulp.task('default', function() {
  gulp
    .src('dist/**')
    .pipe(revAll.revision())
    .pipe(dest('dist'))
    .pipe(revAll.manifestFile())
    .pipe(dest('dist'));
});
