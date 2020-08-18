import { HookOptions } from '@balm-core/index';

class FtpTask extends BalmJS.BalmTask {
  constructor() {
    super('ftp');
  }

  get options(): object {
    return Object.assign({}, BalmJS.config.ftp.options, this.customOptions);
  }

  recipe(localFiles?: string | string[], options: HookOptions = {}): Function {
    const balmFtp = (): any => {
      const taskName = `${this.name} task`;

      const input = localFiles || BalmJS.watchFtpFile;
      if (input) {
        this.init(input, null, options);

        if (!options.src) {
          this.gulpSrcOptions = {
            base: '.'
          };
        }

        let stream: any = this.src;

        try {
          stream = stream.pipe(BalmJS.plugins.sftp(this.options));
        } catch (error) {
          BalmJS.logger.error(taskName, error.message);
        }

        return stream;
      } else {
        BalmJS.logger.warn(taskName, 'Invalid local files');
      }
    };

    return balmFtp;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default FtpTask;
