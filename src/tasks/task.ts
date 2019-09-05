import cssnano from 'cssnano';

const TIME_FLAG = 'BalmJS Time';

class BalmTask {
  protected _name: string;
  protected _taskName: string;

  constructor(name: string) {
    this._name = name;
    this._taskName =
      name === 'default' ? name : (BalmJS.toNamespace(name) as string);
  }

  get name(): string {
    return this._name;
  }

  get taskName(): string {
    return this._taskName;
  }
}

class StyleTask extends BalmTask {
  constructor(name: string) {
    super(name);
  }

  show(name: string): void {
    console.log(`${name} task`);
  }

  handleStyle(stream: any, output: any): void {
    return stream
      .pipe(
        $.postcss(
          BalmJS.plugins.getPostcssPlugins(),
          BalmJS.config.styles.postcssOptions
        )
      )
      .pipe($.if(BalmJS.config.isDev, $.sourcemaps.write('.')))
      .pipe(
        $.if(
          BalmJS.config.isProd,
          $.postcss([cssnano(BalmJS.config.styles.options)])
        )
      )
      .pipe(gulp.dest(BalmJS.file.absPaths(output)))
      .pipe(BalmJS.server.reload({ stream: true }));
  }

  // handleError(): void {}
}

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.StyleTask = StyleTask;
BalmJS.mixins = [];
BalmJS.recipes = [];
BalmJS.recipeIndex = 0;

export { BalmTask, StyleTask };
