import Maker from './maker';

class Hooks {
  sass(input: string, output: string): void {
    Maker.generate('sass', [input, output]);
  }

  less(input: string, output: string): void {
    Maker.generate('less', [input, output]);
  }

  postcss(input: string, output: string): void {
    Maker.generate('postcss', [input, output]);
  }
}

export default Hooks;
