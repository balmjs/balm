import Maker from './maker';

class BaseHooks {
  sass(input: string, output: string): void {
    Maker.generate('sass', [input, output]);
  }

  less(input: string, output: string): void {
    Maker.generate('less', [input, output]);
  }

  postcss(input: string, output: string): void {
    Maker.generate('postcss', [input, output]);
  }

  // styles(input: string[], output: string): void {}

  js(
    input: string | string[] | { [entryChunkName: string]: string | string[] },
    output: string,
    options?: any
  ): void {
    Maker.generate('script', [input, output, options]);
  }

  // scripts(input: string[], output: string): void {}

  copy(
    input: string | string[],
    output: string,
    renameOptions: object = {}
  ): void {
    Maker.generate('copy', [input, output, renameOptions]);
  }

  remove(input: string | string[]): void {
    Maker.generate('remove', [input]);
  }
}

class Hooks extends BaseHooks {
  watch(handler: Function): void {
    Maker.generate('watch', [handler]);
  }
}

export default Hooks;
