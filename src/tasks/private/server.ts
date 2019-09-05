class ServerTask extends BalmJS.BalmTask {
  constructor() {
    super('serve');
  }

  fn(cb: Function): void {
    console.log('server task');
    cb();
  }
}

export = ServerTask;
