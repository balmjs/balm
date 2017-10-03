class Remove extends Task {
  constructor(input) {
    super('remove');

    this.input = input;
  }
  get fn() {
    return () => {
      if (this.input) {
        del(this.input, {force: true}).then(paths => {
          logger.error('[Remove] Deleted files and folders', paths);
        });
      } else {
        logger.warning('[Remove]', 'Invalid path');
      }
    };
  }
}

export default Remove;
