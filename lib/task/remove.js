class Remove extends Task {
  constructor() {
    super('remove');
  }
  get fn() {
    return (input = '') => {
      if (input) {
        require('del')(input, {
          force: true
        }).then(paths => {
          $.util.log($.util.colors.red('Deleted files and folders:' + RN, paths.join(RN)));
        });
      }
    };
  }
}

export default Remove;
