import { HookOptions } from '@balm-core/index';

class SassTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('sass');
  }

  get options(): object {
    return Object.assign(
      node.isLegacySass
        ? {
            includePaths: BalmJS.file.stylePaths,
            outputStyle: 'expanded'
          }
        : {
            loadPaths: BalmJS.file.stylePaths,
            sourceMap: true
          },
      { quietDeps: BalmJS.config.logs.level < BalmJS.LogLevel.Warn },
      BalmJS.config.styles.sassOptions,
      this.customOptions
    );
  }

  recipe(
    input?: string | string[],
    output?: string,
    options: HookOptions = {}
  ): Function {
    const balmSass = (): any => {
      this.init(input, output, options);

      return this.handleStyle(this.name, this.output, this.options);
    };

    return balmSass;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default SassTask;
