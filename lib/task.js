class Task {
  constructor(name) {
    this.name = name;
  }
  get deps() {
    return [];
  }
  get fn() {
    return () => {};
  }
  getAbsPaths(_paths) {
    let paths = [];

    if (Array.isArray(_paths)) {
      for (let _path of _paths) {
        paths.push(path.join(config.workspace, _path));
      }
    } else {
      paths = [path.join(config.workspace, _paths)];
    }

    return paths;
  }
  getStyleTask() {
    return config.styles.ext === 'scss' ?
      'sass' :
      config.styles.ext;
  }
  getImageDist() {
    return config.production ?
      config.target.img :
      config.tmp.img;
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
