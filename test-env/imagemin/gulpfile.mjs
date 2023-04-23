import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gulp from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

const plugins = [gifsicle(), mozjpeg(), optipng(), svgo()];

export default () =>
  gulp
    .src(path.join(workspace, 'src/images/*'))
    .pipe(
      imagemin(plugins, {
        verbose: true
      })
    )
    .pipe(gulp.dest('dist/images'));
