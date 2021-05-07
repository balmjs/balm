import loading from './loading.js';

class BalmCompiling {
  #firstCompile = true;

  start(): void {
    if (this.#firstCompile) {
      loading.render('Compiling to JS...');
    }
  }

  stop(): void {
    if (this.#firstCompile) {
      this.#firstCompile = false;
      loading.clear();
    }
  }
}

export default new BalmCompiling();
