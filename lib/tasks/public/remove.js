import { isString, isArray } from '../../utilities';

class RemoveTask extends BalmTask {
  constructor(input) {
    super('remove');

    this.input = input;
  }

  get fn() {
    return async cb => {
      let canDel =
        (isString(this.input) && this.input.trim()) ||
        (isArray(this.input) && this.input.length);

      if (canDel) {
        let files = BalmFile.absPaths(this.input);
        // NOTE: compatible with windows for `del@5.x`
        files = isArray(this.input)
          ? files.map(file => file.replace(/\\/g, '/'))
          : files.replace(/\\/g, '/');

        let deletedPaths = await del(files, { force: true });
        logger.warn(
          '[Remove Task]',
          `Files and directories that would be deleted:\n${deletedPaths.join(
            '\n'
          )}`
        );
      } else {
        logger.error('[Remove Task]', 'Invalid path');
      }

      cb();
    };
  }
}

export default RemoveTask;
