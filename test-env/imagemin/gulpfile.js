const path = require('path');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

const plugins = [
  imagemin.gifsicle(),
  imagemin.mozjpeg(),
  imagemin.optipng(),
  imagemin.svgo()
];

exports.default = () =>
  gulp
    .src(path.join(workspace, 'src/images/*'))
    .pipe(
      imagemin(plugins, {
        verbose: true
      })
    )
    .pipe(gulp.dest('dist/images'));
