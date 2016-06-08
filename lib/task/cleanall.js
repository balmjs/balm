class CleanAll {
  get name() {
    return 'clean:all';
  }
  get deps() {
    return [];
  }
  get fn() {
    return del.bind(null, [config.tmp.base, config.target.base]);
  }
}

export default CleanAll;
