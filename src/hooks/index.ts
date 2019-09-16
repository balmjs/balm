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

  js(input: string, output: string): void {
    Maker.generate('script', [input, output]);
  }
}

class Hooks extends BaseHooks {
  watch(handler: Function): void {
    Maker.generate('watch', [handler]);
  }
}

export default Hooks;
