const wiredep = require('wiredep').stream;

const errorHandler = () => {
  logger.warn(
    '[Wiredep Task]',
    `ENOENT: no such file or directory, open '${config.workspace}/bower.json'`,
    config.debug
  );
};

class WiredepTask extends BalmTask {
  constructor() {
    super('wiredep');

    this.input = `${config.source.base}/*.html`;
    this.output = config.source.base;
  }

  get fn() {
    return () => {
      return src(this.input)
        .pipe(
          $.plumber({
            errorHandler
          })
        )
        .pipe(
          wiredep({
            cwd: config.workspace,
            ignorePath: /^(\.\.\/)*\.\./
          })
        )
        .pipe(dest(this.output));
    };
  }
}

export default WiredepTask;
