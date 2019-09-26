class StyleTask extends BalmJS.BalmTask {
  constructor() {
    super('style');
  }

  get deps(): string[] {
    return [this.styleName, 'url'];
  }
}

export default StyleTask;
