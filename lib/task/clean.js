class Clean {
  get name() {
    return 'clean';
  }
  get deps() {
    return [];
  }
  get fn() {
    return del.bind(null, [config.tmp.base]);
  }
}

export default Clean;
