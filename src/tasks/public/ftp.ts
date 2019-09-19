class FtpTask extends BalmJS.BalmTask {
  constructor() {
    super('ftp');

    this.defaultInput = BalmJS.config.ftp.watchFiles;
  }

  recipe(localFiles: string | string[], customOptions: object = {}): void {
    this.init(localFiles);

    const options = Object.assign(BalmJS.config.ftp.options, customOptions);

    gulp
      .src(BalmJS.file.absPaths(this.input), { allowEmpty: true })
      .pipe(BalmJS.plugins.sftp(options));
  }

  fn(cb: Function): void {
    cb();
  }
}

export = FtpTask;
