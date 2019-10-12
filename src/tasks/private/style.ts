class StyleTask extends BalmJS.BalmTask {
  constructor() {
    super('style');
  }

  get deps(): string[] {
    return [
      this.styleName,
      ...(BalmJS.config.env.isProd || !BalmJS.config.inFrontend ? ['url'] : [])
    ];
  }
}

export default StyleTask;
