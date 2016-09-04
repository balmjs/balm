class Remove extends BalmJS.Task {
  constructor() {
    super('remove');
  }
  get fn() {
    return (input = '') => {
      if (!input) {
        $.util.log($.util.colors.yellow('Remove:', 'error path'));
      }

      del(input, {
        force: true
      }).then(paths => {
        $.util.log($.util.colors.red('Remove:', 'Deleted files and folders', paths));
      });
    };
  }
}

export default Remove;
