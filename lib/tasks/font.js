/**
 * 2. Icon Font
 */
class Font extends BalmTask {
  constructor() {
    super('fonts');

    this.input = require('main-bower-files')(
      '**/*.{eot,svg,ttf,woff,woff2}',
      {
        paths: config.workspace
      },
      BalmJS.noop
    ).concat(`${config.source.font}/**/*`);
  }

  get task() {
    return () => {
      return src(this.input).pipe(
        $.if(config.production, dest(config.target.font), dest(config.tmp.font))
      );
    };
  }
}

export default Font;
