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

  js(
    input: string | string[] | { [entryChunkName: string]: string | string[] },
    output: string,
    options?: any
  ): void {
    Maker.generate('script', [input, output, options]);
  }
}

class Hooks extends BaseHooks {
  watch(handler: Function): void {
    Maker.generate('watch', [handler]);
  }
}

export default Hooks;
