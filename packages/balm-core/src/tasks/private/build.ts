import gulpSize from 'gulp-size';

class BuildTask extends BalmJS.BalmTask {
  constructor() {
    super('build');

    this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.dest.base);
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(
      gulpSize({
        title: this.name,
        gzip: true
      })
    );
  };
}

export default BuildTask;
