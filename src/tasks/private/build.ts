class BuildTask extends BalmJS.BalmTask {
  constructor() {
    super('build');

    this.defaultInput = `${BalmJS.config.dest.base}/**/*`;
  }

  fn(): void {
    this.init();

    this.src.pipe(
      $.size({
        title: this.name,
        gzip: true
      })
    );
  }
}

export default BuildTask;
