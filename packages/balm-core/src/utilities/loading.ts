// Reference `cli-spinners`
const spinner = {
  interval: 80,
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
};

class BalmLoading {
  #stream: NodeJS.WriteStream & {
    fd: 2;
  } = process.stderr;

  #frameIndex = 0;
  #frameCount = spinner.frames.length;

  get frame(): string {
    const currentFrame = spinner.frames[this.#frameIndex];
    this.#frameIndex = ++this.#frameIndex % this.#frameCount;
    return currentFrame;
  }

  clear() {
    this.#stream.clearLine(0);
    this.#stream.cursorTo(0);
  }

  render() {
    this.clear();
    this.#stream.write(`${this.frame} Loading BalmJS...`);
  }

  succeed(text: string) {
    this.clear();
    console.log(text);
  }
}

export default new BalmLoading();
