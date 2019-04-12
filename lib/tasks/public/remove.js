import { isString, isArray } from '../../utilities';

class RemoveTask extends BalmTask {
  constructor(input) {
    super('remove');

    this.input = input;
  }

  get fn() {
    return cb => {
      let canDel =
        (isString(this.input) && this.input.trim()) ||
        (isArray(this.input) && this.input.length);

      if (canDel) {
        return del(BalmFile.absPaths(this.input), { force: true }).then(
          paths => {
            logger.warn('[Remove Task] Deleted files or folders', paths);
          }
        );
      }

      logger.error('[Remove Task]', 'Invalid path');
      cb();
    };
  }
}

export default RemoveTask;
