class CleanAll {
  get name() {
    return 'clean:all';
  }
  get deps() {
    return [];
  }
  get fn() {
    return del.bind(null, [config.tmp.base, config.dist.base]);
  }
}

export default CleanAll;
