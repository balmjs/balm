import sftp from '../../plugins/sftp';

class FtpTask extends BalmTask {
  constructor(localFiles, options = {}) {
    super('ftp');

    this.localFiles = localFiles || config.ftp.watchFiles;
    this.options = Object.assign({}, config.ftp.options, options);
  }

  get fn() {
    return () => {
      return src(BalmFile.absPaths(this.localFiles), {
        allowEmpty: true
      }).pipe(sftp(this.options));
    };
  }
}

export default FtpTask;
