class Task {
  constructor(name) {
    this.name = name;

    switch (name) {
      case 'styles':
        this.dist = config.production ? config.target.css : config.tmp.css;
        break;
      case 'images':
      case 'sprites':
      case 'svg':
        this.dist = config.production ? config.target.img : config.tmp.img;
        break;
      case 'fonts':
        this.dist = config.production ? config.target.font : config.tmp.font;
        break;
      default:
        this.dist = '';
    }
  }
  get deps() {
    return [];
  }
  get fn() {
    return noop;
  }
  getAbsPaths(path) {
    let paths = [];

    if (Array.isArray(path)) {
      for (let value of path) {
        paths.push(path.join(config.workspace, value));
      }
    } else {
      paths = [path.join(config.workspace, path)];
    }

    return paths;
  }
  getStyleTask() {
    let task = 'css';

    switch (config.styles.ext) {
      case 'sass':
      case 'scss':
        task = 'sass';
        break;
      case 'less':
        task = 'less';
        break;
      default:
    }

    return task;
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
