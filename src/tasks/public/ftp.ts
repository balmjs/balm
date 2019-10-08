import { HookOptions } from '../../config/types';

class FtpTask extends BalmJS.BalmTask {
  constructor() {
    super('ftp');

    this.defaultInput = BalmJS.config.ftp.files;
  }

  get options(): object {
    return Object.assign({}, BalmJS.config.ftp.options, this.customOptions);
  }

  recipe(localFiles: string | string[], options: HookOptions = {}): any {
    return (): any => {
      this.init(localFiles, null, options);

      let stream: any;

      try {
        stream = this.src.pipe(BalmJS.plugins.sftp(this.options));
      } catch (error) {
        // Catch "throw"
        BalmJS.logger.error(`${this.name} task`, error.message);
      }

      return stream;
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default FtpTask;
