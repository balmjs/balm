import gulp from 'gulp';
import { deleteAsync } from 'del';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import excludeGitignore from 'gulp-exclude-gitignore';

const BALM = {
  compiler: {
    src: 'packages/balm-core/src/**/*.ts',
    dest: 'packages/balm-core/lib'
  },
  runtime: {
    src: 'packages/balm/src/**/*.js',
    dest: 'packages/balm/lib'
  }
};

const { task, src, dest, series } = gulp;

function clean() {
  return deleteAsync([BALM.compiler.dest, BALM.runtime.dest]);
}

function buildCore() {
  return src(BALM.compiler.src).pipe(babel()).pipe(dest(BALM.compiler.dest));
}

function buildRuntime() {
  return src(BALM.runtime.src).pipe(babel()).pipe(dest(BALM.runtime.dest));
}

const build = series(buildCore, buildRuntime);

task('format', function () {
  return src(BALM.compiler.src)
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

task('clean', clean);
task('build', build);

task('prepublish', series(clean, build));
