import zip from 'gulp-zip';

class ZipTask extends BalmJS.BalmTask {
  constructor() {
    super('zip');

    this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.roots.target);
    this.defaultOutput = '.';
  }

  recipe(
    input?: string | string[],
    output?: string,
    filename = 'archive.zip'
  ): Function {
    const balmZip = (): any => {
      this.init(input, output);

      return this.src.pipe(zip(filename)).pipe(gulp.dest(this.output));
    };

    return balmZip;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default ZipTask;
