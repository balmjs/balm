import del from 'del';

class RemoveTask extends BalmJS.BalmTask {
  constructor() {
    super('remove');
  }

  recipe(input: string | string[]): any {
    return async (cb: Function): Promise<any> => {
      this.init(input);

      const canDel: boolean =
        (BalmJS.utils.isString(this.input) && this.input.trim()) ||
        (BalmJS.utils.isArray(this.input) && this.input.length);

      if (canDel) {
        let files: string | string[] = BalmJS.file.absPaths(this.input);
        // NOTE: compatible with windows for `del@5.x`
        files = BalmJS.utils.isArray(this.input)
          ? (files as string[]).map((file: string) => file.replace(/\\/g, '/'))
          : (files as string).replace(/\\/g, '/');

        BalmJS.logger.debug(
          `${this.name} task`,
          {
            files
          },
          {
            pre: true
          }
        );

        const deletedPaths: string[] = await del(files, { force: true });

        BalmJS.logger.warn(
          `${this.name} task`,
          {
            deletedPaths
          },
          {
            pre: true
          }
        );
      } else {
        BalmJS.logger.error(`${this.name} task`, 'Invalid input');
      }

      cb();
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default RemoveTask;
