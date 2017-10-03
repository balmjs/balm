class Remove extends Task {
  constructor(input = '') {
    super('remove');

    this.input = input;
  }
  get fn() {
    return () => {
      if (!this.input) {
        logger.warning('[Remove]', 'Invalid path');
      }

      del(this.input, {force: true}).then(paths => {
        logger.error('[Remove] Deleted files and folders', paths);
      });
    };
  }
}

export default Remove;
