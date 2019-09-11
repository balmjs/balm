import cssnano from 'cssnano';

const TIME_FLAG = 'BalmJS Time';

class BalmTask {
  protected _name: string;
  protected _taskName: string;

  protected _input: string | string[] = '';
  protected _output = '';
  protected _defaultInput: string | string[] = '';
  protected _defaultOutput = '';

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

  get defaultInput(): string | string[] {
    return this._defaultInput;
  }
  set defaultInput(input: string | string[]) {
    this._defaultInput = input;
  }

  get defaultOutput(): string {
    return this._defaultOutput;
  }
  set defaultOutput(output: string) {
    this._defaultOutput = output;
  }

  init(input: string | string[], output: string): void {
    // const customTask = BalmJS.customTasksIterator.next().value;
    // if (!customTask.done) {
    //   this.input = customTask.input || this.defaultInput;
    //   this.output = customTask.output || this.defaultOutput;
    // } else {
    this.input = input || this.defaultInput;
    this.output = output || this.defaultOutput;
    // }
  }
}

class StyleTask extends BalmTask {
  constructor(name: string) {
    super(name);

    this.defaultOutput =
      BalmJS.config.isProd || !BalmJS.config.inFrontend
        ? path.join(
            BalmJS.config.roots.target,
            BalmJS.config.assets.subDir,
            BalmJS.config.assets.buildDir,
            BalmJS.config.paths.target.css
          )
        : path.join(BalmJS.config.roots.tmp, BalmJS.config.paths.tmp.css);
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
      .pipe(gulp.dest(BalmJS.file.absPaths(output)));
    // .pipe(BalmJS.server.reload({ stream: true }));
  }

  handleError = function(this: any, error: any): void {
    // https://github.com/floatdrop/gulp-plumber/issues/30
    BalmJS.logger.error('Style Task', error.message, true);
    // Must emit end event for any dependent streams to pick up on this. Destroying the stream
    // ensures nothing else in that stream gets done, for example, if we're dealing with five
    // files, after an error in one of them, any other won't carry on. Doing destroy without
    // ending it first will not notify depending streams, tasks like `watch` will hang up.
    this.emit('end');
    this.destroy();
  };
}

// function run(tasks: any): void {
//   gulp.parallel(...tasks)();
// }

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.StyleTask = StyleTask;
BalmJS.tasks = []; // Maintasks
BalmJS.recipes = []; // Subtasks
BalmJS.recipeIndex = 0;
// BalmJS.run = run;

export { BalmTask, StyleTask };
