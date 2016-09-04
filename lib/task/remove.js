class Remove extends BalmJS.Task {
  constructor() {
    super('remove');
  }
  get fn() {
    return (input = '') => {
      if (!input) {
        BalmJS.log('Remove', 'error path', 'warning');
      }

      del(input, {
        force: true
      }).then(paths => {
        BalmJS.log('Deleted files and folders', paths, 'danger');
      });
    };
  }
}

export default Remove;
