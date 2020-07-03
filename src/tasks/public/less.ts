import { HookOptions } from '@balm/index';

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
  ): any {
    return (): any => {
      this.init(input, output, options);

      return this.handleStyle(this.name, this.output, this.options);
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default LessTask;
