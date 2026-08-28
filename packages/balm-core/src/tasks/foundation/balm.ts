import { BalmError } from '@balm-core/index.js';

class BalmTask {
  public name: any;
  public taskName: any;

  public defaultInput: any = '';
  public defaultOutput: any = '';

  public input: any = '';
  public output: any = '';
  public customOptions: any = {};
  public gulpSrcOptions: any = {};

  constructor(name: string) {
    this.name = name;
    this.taskName = BalmJS.toNamespace(name) as string;
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
        this.input,
        Object.assign(
          {
            allowEmpty: true,
            encoding: false
          },
          this.gulpSrcOptions
        )
      )
      .pipe(
        BalmJS.plugins.plumber((error: BalmError): void => {
          BalmJS.logger.error(`${this.name} task`, error.message);
        })
      );
  }

  init(input?: string | string[], output?: string, options: any = {}): void {
    let key: string = this.name;
    switch (key) {
      case 'copy':
        key = 'rename';
        break;
      case 'jsmin':
        key = 'terser';
        break;
      default:
    }

    const useAbsPath = !['webpack', 'rollup', 'esbuild', 'sprite'].includes(
      key
    );
    this.input = useAbsPath && (input || this.defaultInput)
      ? BalmJS.file.absPaths(input || this.defaultInput)
      : input || this.defaultInput;
    this.output = useAbsPath && typeof (output || this.defaultOutput) === 'string'
      ? BalmJS.file.absPath(output || this.defaultOutput)
      : output || this.defaultOutput;
    this.customOptions = options[key] || {};

    const obj: {
      input: string | string[];
      output: string;
      customOptions?: any;
    } = {
      input: this.input,
      output: this.output
    };
    if (options[key]) {
      obj.customOptions = this.customOptions;
    }

    if (useAbsPath) {
      BalmJS.logger.debug(`${this.name} task`, obj, {
        pre: true
      });
    }

    if (options.src) {
      this.gulpSrcOptions = options.src;
    }
  }
}

export default BalmTask;
