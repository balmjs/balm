class FtpTask extends BalmTask {
  constructor(localFiles, options = {}) {
    super('ftp');

    this.localFiles = localFiles;
    this.options = Object.assign({}, config.ftp, options);
  }

  get fn() {
    return () => {
      return src(BalmFile.absPaths(this.localFiles)).pipe($.sftp(this.options));
    };
  }
}

export default FtpTask;
