import { task, src, dest, series } from 'gulp';
import del from 'del';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import excludeGitignore from 'gulp-exclude-gitignore';

const BALM = {
  core: {
    src: 'packages/balm-core/src/**/*.ts',
    dest: 'packages/balm-core/lib'
  },
  runtime: {
    src: 'packages/balm/src/*.js',
    dest: 'packages/balm/lib'
  }
};

function clean() {
  return del([BALM.core.dest, BALM.runtime.dest]);
}

function buildCore() {
  return src(BALM.core.src).pipe(babel()).pipe(dest(BALM.core.dest));
}

function buildRuntime() {
  return src(BALM.runtime.src).pipe(babel()).pipe(dest(BALM.runtime.dest));
}

const build = series(buildCore, buildRuntime);

task('format', function () {
  return src(BALM.core.src)
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

task('clean', clean);
task('build', build);

task('prepublish', series(clean, build));
