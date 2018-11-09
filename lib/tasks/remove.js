import { isString, isArray } from '../utilities';

class Remove extends BalmTask {
  constructor(input) {
    super('remove');

    this.input = input;
  }

  get task() {
    return () => {
      let canDel =
        (isString(this.input) && this.input.trim()) ||
        (isArray(this.input) && this.input.length);

      return canDel
        ? del(BalmFile.absPaths(this.input), { force: true }).then(paths => {
            logger.warn('[Remove] Deleted files or folders', paths);
          })
        : logger.error('[Remove]', 'Invalid path');
    };
  }
}

export default Remove;
