class Ftp extends BalmTask {
  constructor(localFiles, options = {}) {
    super('ftp');

    this.localFiles = localFiles;
    this.options = Object.assign({}, config.ftp, options);
  }

  get fn() {
    return () => {
      console.log('[FTP]', this.options);
      return src(BalmFile.absPaths(this.localFiles)).pipe($.sftp(this.options));
    };
  }
}

export default Ftp;
