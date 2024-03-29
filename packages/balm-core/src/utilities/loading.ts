import readline from 'readline';
import spinner from '../config/spinner.js';

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
    // Compatibility on Windows
    readline.clearLine(this.#stream, 0);
    readline.cursorTo(this.#stream, 0);
  }

  render(text = `${this.frame} BalmJS is initializing...`) {
    this.clear();
    this.#stream.write(text);
  }

  succeed() {
    this.clear();
    console.log(`BalmJS core version: ${BalmJS.version}`);
  }
}

export default new BalmLoading();
