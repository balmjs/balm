class Clean {
  get name() {
    return 'clean';
  }
  get deps() {
    return [];
  }
  get fn() {
    let folder = [config.tmp.base];
    if (config.static) {
      folder.push(config.target.base);
    }

    return del.bind(null, folder);
  }
}

export default Clean;
