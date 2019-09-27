import del from 'del';

class RemoveTask extends BalmJS.BalmTask {
  constructor() {
    super('remove');
  }

  recipe(cb: Function, input: string | string[]): void {
    this.init(input);

    const canDel =
      (BalmJS.utils.isString(this.input) && this.input.trim()) ||
      (BalmJS.utils.isArray(this.input) && this.input.length);

    if (canDel) {
      let files: string | string[] = BalmJS.file.absPaths(this.input);
      // NOTE: compatible with windows for `del@5.x`
      files = BalmJS.utils.isArray(this.input)
        ? (files as string[]).map((file: string) => file.replace(/\\/g, '/'))
        : (files as string).replace(/\\/g, '/');

      (async (): Promise<any> => {
        const deletedPaths: string[] = await del(files, { force: true });

        BalmJS.logger.warn(
          'remove task',
          {
            deletedPaths
          },
          {
            pre: true
          }
        );
        cb();
      })();
    } else {
      BalmJS.logger.error('remove task', 'Invalid input');
      cb();
    }
  }

  fn(cb: Function): void {
    cb();
  }
}

export default RemoveTask;
