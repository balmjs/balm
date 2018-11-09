class Ftp extends BalmTask {
  constructor(input = '') {
    super('ftp');

    this.input = input;
  }

  get task() {
    return () => {
      return src(BalmFile.absPaths(this.input)).pipe($.sftp(config.ftp));
    };
  }
}

export default Ftp;
