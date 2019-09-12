const wiredep = require('wiredep').stream;

class WiredepTask extends BalmJS.BalmTask {
  constructor() {
    super('wiredep');

    this.defaultInput = `${BalmJS.config.source.base}/*.html`;
    this.defaultOutput = BalmJS.config.source.base;
  }

  fn(cb: Function): void {
    this.init();

    gulp
      .src(this.input)
      .pipe(
        $.plumber(function() {
          BalmJS.logger.warn(
            '<wiredep task>',
            `ENOENT: no such file or directory, open '${BalmJS.config.workspace}/bower.json'`
          );
        })
      )
      .pipe(
        wiredep({
          cwd: BalmJS.config.workspace,
          ignorePath: /^(\.\.\/)*\.\./
        })
      )
      .pipe(gulp.dest(this.output));

    cb();
  }
}

export = WiredepTask;
