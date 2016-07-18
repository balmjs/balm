class Task {
  constructor(name) {
    this.name = name;

    switch (name) {
      case 'styles':
        this.dist = !config.production ? config.tmp.css : config.target.css;
        break;
      case 'images':
      case 'sprites':
      case 'svg':
        this.dist = !config.production ? config.tmp.img : config.target.img;
        break;
      case 'fonts':
        this.dist = !config.production ? config.tmp.font : config.target.font;
        break;
      default:
        this.dist = '';
    }
  }
  get deps() {
    return [];
  }
  getSpriteTask() {
    let tasks = [];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }

    if (config.sprites.svg.length) {
      tasks.push('svg');
    }

    return tasks;
  }
}

export default Task;
