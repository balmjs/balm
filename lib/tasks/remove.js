class Remove extends BalmJS.Task {
  constructor() {
    super('remove');
  }
  get recipe() {
    return true;
  }
  get fn() {
    return (input = '') => {
      if (!input) {
        logger.warning('[Remove]', 'Invalid path');
      }

      del(input, {force: true}).then(paths => {
        logger.error('[Remove] Deleted files and folders', paths);
      });
    };
  }
}

export default Remove;
