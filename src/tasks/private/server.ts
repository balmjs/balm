class ServerTask extends BalmJS.BalmTask {
  constructor() {
    super('serve');
  }

  fn(): void {
    console.log('server task');
  }
}

export = ServerTask;
