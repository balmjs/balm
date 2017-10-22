import {isString, isArray} from '../helpers/index';

class Remove extends Task {
  constructor(input) {
    super('remove');

    this.input = input;
  }
  get fn() {
    return () => {
      let canDel = (isString(this.input) && this.input.trim()) || (isArray(this.input) && this.input.length);

      if (canDel) {
        del(File.absPaths(this.input), {force: true}).then(paths => {
          logger.error('[Remove] Deleted files and folders', paths);
        });
      } else {
        logger.warning('[Remove]', 'Invalid path');
      }
    };
  }
}

export default Remove;
