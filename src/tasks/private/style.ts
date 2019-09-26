class StyleTask extends BalmJS.BalmTask {
  constructor() {
    super('style');
  }

  get deps(): string[] {
    return [this.styleName, ...(BalmJS.config.env.isProd ? ['url'] : [])];
  }
}

export default StyleTask;
