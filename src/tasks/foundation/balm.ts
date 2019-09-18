class BalmTask {
  protected _name: string;
  protected _taskName: string;

  protected _input: any;
  protected _output = '';
  protected _defaultInput: any;
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

  init(input?: string | string[], output?: string): void {
    // const customTask = BalmJS.customTasksIterator.next().value;
    // if (!customTask.done) {
    //   this.input = customTask.input || this.defaultInput;
    //   this.output = customTask.output || this.defaultOutput;
    // } else {
    this.input = input || this.defaultInput;
    this.output = output || this.defaultOutput;
    // }

    if (BalmJS.config.logs.level <= BalmJS.LogLevel.Info) {
      BalmJS.logger.info(`<${this.name} task>`, {
        input: this.input,
        output: this.output
      });
    }
  }
}

export default BalmTask;
