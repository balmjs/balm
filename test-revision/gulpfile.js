const gulp = require('gulp');
const revAll = require('gulp-rev-all');
const del = require('del');

const cleanTask = () => {
  return del('dist');
};

const revAllTask = () => {
  return gulp
    .src('app/**')
    .pipe(
      revAll.revision({
        fileNameManifest: 'rev-manifest.json',
        dontRenameFile: ['.html', '.php'],
        dontUpdateReference: ['.html', '.php']
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('dist'));
};

gulp.task('default', gulp.series(cleanTask, revAllTask));
