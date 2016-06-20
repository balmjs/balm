class Clean {
  get name() {
    return 'clean';
  }
  get deps() {
    return [];
  }
  get fn() {
    let folder = [config.roots.tmp, config.roots.cache];
    if (config.static) {
      folder.push(config.roots.target);
    } else {
      folder.push(config.target.css);
      folder.push(config.target.js);
    }

    return del.bind(null, folder);
  }
}

export default Clean;
