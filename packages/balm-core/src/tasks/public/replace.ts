import { ReplaceOptions } from '@balm-core/index';

class ReplaceTask extends BalmJS.BalmTask {
  constructor() {
    super('replace');
  }

  recipe(
    input: string | string[],
    output: string,
    options: ReplaceOptions | ReplaceOptions[]
  ): Function {
    const balmReplace = (): any => {
      this.init(input, output);

      let stream: any = this.src;

      if (BalmJS.utils.isArray(options)) {
        const replaceOptions: ReplaceOptions[] = options as ReplaceOptions[];
        replaceOptions.forEach((replaceOption) => {
          stream = stream.pipe(
            BalmJS.plugins.replace(
              replaceOption.substr,
              replaceOption.replacement
            )
          );
        });
      } else {
        const replaceOption: ReplaceOptions = options as ReplaceOptions;
        stream = stream.pipe(
          BalmJS.plugins.replace(
            replaceOption.substr,
            replaceOption.replacement
          )
        );
      }

      return stream.pipe(gulp.dest(this.output));
    };

    return balmReplace;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default ReplaceTask;
