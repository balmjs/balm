class FtpTask extends BalmJS.BalmTask {
  constructor() {
    super('ftp');
  }

  get options(): object {
    return Object.assign({}, BalmJS.config.ftp.options, this.customOptions);
  }

  recipe(
    localFiles?: string | string[],
    ftpOptions?: object,
    gulpSrcOptions?: object
  ): any {
    return (): any => {
      const taskName = `${this.name} task`;

      this.init(
        localFiles || BalmJS.watchFtpFile,
        null,
        ftpOptions,
        gulpSrcOptions || {
          base: '.'
        }
      );

      if (this.input) {
        let stream: any = this.src;

        try {
          stream = stream.pipe(BalmJS.plugins.sftp(this.options));
        } catch (error) {
          // Catch "throw"
          BalmJS.logger.error(taskName, error.message);
        }

        return stream;
      } else {
        BalmJS.logger.warn(taskName, 'Invalid local files');
      }
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default FtpTask;
