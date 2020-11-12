class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');
  }

  get deps(): string[] {
    return [BalmJS.config.scripts.bundler];
  }
}

export default ScriptTask;
