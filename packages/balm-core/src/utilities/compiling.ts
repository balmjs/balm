import loading from './loading.js';

class BalmCompiling {
  #firstCompile = true;

  start(): void {
    if (!BalmJS.useCacache && this.#firstCompile) {
      loading.render('Compiling to JS...');
    }
  }

  stop(): void {
    if (!BalmJS.useCacache && this.#firstCompile) {
      this.#firstCompile = false;
      loading.clear();
    }
  }
}

export default new BalmCompiling();
