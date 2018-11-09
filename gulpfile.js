const { task, series, src, dest } = require('gulp');
const path = require('path');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const nsp = require('gulp-nsp');
const babel = require('gulp-babel');
const del = require('del');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('@babel/register');

task('static', () => {
  return src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

task('nsp', cb => {
  nsp({ package: path.resolve('package.json') }, cb);
});

const cleanTask = () => {
  return del('dist');
};

const babelTask = () => {
  return src('lib/**/*.js')
    .pipe(babel())
    .pipe(dest('dist'));
};

task('clean', cleanTask);

task('build', series(cleanTask, babelTask));

task('prepublish', series(babelTask));
