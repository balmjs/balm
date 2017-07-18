import {isArray} from './helper';

class Task {
  constructor(name) {
    this.name = name;
  }
  get recipe() {
    return false;
  }
  get deps() {
    return [];
  }
  get fn() {
    return BalmJS.noop;
  }
  getPublicPath() {
    return $.replace(`${config.assets.publicUrlPlaceholder}/`, config.scripts.publicPath);
  }
  getAbsPaths(_paths) {
    let paths;

    if (isArray(_paths)) {
      paths = [];
      for (let _path of _paths) {
        paths.push(path.join(config.workspace, _path));
      }
    } else {
      paths = path.join(config.workspace, _paths);
    }

    return paths;
  }
  getStyleTask() {
    return config.styles.ext === 'scss'
      ? 'sass'
      : config.styles.ext;
  }
  getStylePath() {
    return config.production
      ? path.join(config.roots.target, config.assets.subDir, config.paths.target.css)
      : path.join(config.roots.tmp, config.paths.tmp.css);
  }
  handleStyle(stream, output) {
    stream = config.production
      ? stream.pipe($.cssnano(config.styles.options))
      : stream.pipe($.sourcemaps.write('.'));

    stream = stream.pipe(gulp.dest(this.getAbsPaths(output)));

    if (!config.production) {
      stream = stream.pipe(browserSync.stream({match: '**/*.css'}));
    }

    return stream;
  }
  getImageDist() {
    return config.production
      ? config.target.img
      : config.tmp.img;
  }
  getSpriteTasks(flag = false) {
    let tasks = [];

    if (config.production || flag) {
      if (config.sprites.image.length) {
        tasks.push('sprites');
      }
      if (config.sprites.svg.length) {
        tasks.push('svg');
      }
    }

    return tasks;
  }
}

export default Task;
