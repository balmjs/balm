class BalmTask {
  protected _name: string;
  protected _taskName: string;

  protected _input: any;
  protected _output = '';
  protected _customOptions: any = {};
  protected _defaultInput: any;
  protected _defaultOutput = '';

  protected _gulpSrcOptions: object = {}; // NOTE: gulp.src options

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
  get defaultInput(): string | string[] {
    return this._defaultInput;
  }
  set defaultInput(input: string | string[]) {
    this._defaultInput = input;
  }

  get output(): string {
    return this._output;
  }
  set output(output: string) {
    this._output = output;
  }
  get defaultOutput(): string {
    return this._defaultOutput;
  }
  set defaultOutput(output: string) {
    this._defaultOutput = output;
  }

  get customOptions(): any {
    return this._customOptions;
  }
  set customOptions(options: any) {
    this._customOptions = options;
  }

  get gulpSrcOptions(): object {
    return this._gulpSrcOptions;
  }
  set gulpSrcOptions(output: object) {
    this._gulpSrcOptions = output;
  }

  get styleName(): string {
    let name: string;

    switch (BalmJS.config.styles.extname) {
      case 'sass':
      case 'scss':
        name = 'sass';
        break;
      case 'less':
        name = 'less';
        break;
      default:
        name = 'postcss';
    }

    return name;
  }

  get src(): any {
    return gulp
      .src(
        BalmJS.file.absPaths(this.input),
        Object.assign({ allowEmpty: true }, this.gulpSrcOptions)
      )
      .pipe(
        BalmJS.plugins.plumber((error: any): void => {
          BalmJS.logger.error(`${this.name} task`, error.message);
        })
      );
  }

  init(
    input?: string | string[],
    output?: string,
    customOptions?: object,
    gulpSrcOptions?: object
  ): void {
    this.input = input || this.defaultInput;
    this.output = output || this.defaultOutput;
    this.customOptions = customOptions || {};
    this.gulpSrcOptions = gulpSrcOptions || {};

    const obj: {
      input: string | string[];
      output: string;
      customOptions?: any;
    } = {
      input: this.input,
      output: this.output
    };
    if (customOptions) {
      obj.customOptions = this.customOptions;
    }

    BalmJS.logger.debug(`${this.name} task`, obj, {
      pre: true
    });
  }
}

export default BalmTask;
