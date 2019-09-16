class WatchTask extends BalmJS.BalmTask {
  constructor() {
    super('watch');
  }

  recipe(handler: Function): void {
    handler('Hello BalmJS');
  }

  fn(): void {
    console.log('watch task');
  }
}

export = WatchTask;
