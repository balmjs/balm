import { HookOptions } from '@balm-core/index';

class LessTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('less');
  }

  get options(): object {
    return Object.assign(
      {
        paths: BalmJS.file.stylePaths
      },
      BalmJS.config.styles.lessOptions,
      this.customOptions
    );
  }

  recipe(
    input?: string | string[],
    output?: string,
    options: HookOptions = {}
  ): Function {
    const balmLess = (): any => {
      this.init(input, output, options);

      return this.handleStyle(this.name, this.output, this.options);
    };

    return balmLess;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default LessTask;
