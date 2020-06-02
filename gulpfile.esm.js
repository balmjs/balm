import { task, src, dest, series } from 'gulp';
import del from 'del';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import excludeGitignore from 'gulp-exclude-gitignore';

const BALM = {
  source: 'src/**/*.ts',
  target: 'lib'
};

function clean() {
  return del(BALM.target);
}

function build() {
  return src(BALM.source).pipe(babel()).pipe(dest(BALM.target));
}

task('format', function () {
  return src(BALM.source)
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

task('clean', clean);
task('build', build);

task('prepublish', series(clean, build));
