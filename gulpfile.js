const { task, series, src, dest } = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('@babel/register');

task('format', () => {
  return src('lib/**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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
