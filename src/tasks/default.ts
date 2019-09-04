class DefaultTask extends BalmJS.BalmTask {
  constructor() {
    super('default');
  }

  fn(cb: Function): void {
    console.log('default task');
    cb();
  }
}

export default DefaultTask;
