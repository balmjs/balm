class Task {
  constructor(name) {
    this.name = name;

    // set dist
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

    // set input & output
    switch (name) {
      // stylesheets
      case 'css':
        this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).css');
        this.output = config.tmp.css;
        break;
      case 'sass':
        this.input = path.join(config.roots.source, config.paths.source.css, '**', '*.scss');
        this.output = config.tmp.css;
        break;
      case 'less':
        this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).less');
        this.output = config.tmp.css;
        break;
        // scripts
      case 'js':
        this.output = config.tmp.js;
        break;
        // others
      case 'zip':
        this.input = path.join(config.roots.target, config.paths.target.base, '**', '*');
        this.output = config.workspace;
        break;
      default:
    }
  }
  get deps() {
    return [];
  }
  get fn() {
    return noop;
  }
  getAbsPaths(src) {
    let paths = [];

    if (Array.isArray(src)) {
      for (let value of src) {
        paths.push(path.join(config.workspace, value));
      }
    } else {
      paths = [path.join(config.workspace, src)];
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
