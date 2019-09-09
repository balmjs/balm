import cssnano from 'cssnano';

const TIME_FLAG = 'BalmJS Time';

class BalmTask {
  protected _name: string;
  protected _taskName: string;

  protected _input: string | string[] = '';
  protected _output = '';

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

  get input(): string | string[] {
    return this._input;
  }
  set input(input: string | string[]) {
    this._input = input;
  }

  get output(): string {
    return this._output;
  }
  set output(output: string) {
    this._output = output;
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

function run(tasks: any): void {
  gulp.parallel(...tasks)();
}

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.StyleTask = StyleTask;
BalmJS.mixins = [];
BalmJS.recipes = [];
BalmJS.recipeIndex = 0;
BalmJS.run = run;

export { BalmTask, StyleTask };
