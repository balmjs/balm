class PostcssTask extends BalmJS.StyleTask {
  constructor() {
    super('postcss');

    this.defaultInput = path.join(
      BalmJS.config.roots.source,
      BalmJS.config.paths.source.css,
      '**',
      '!(_*).css'
    );
  }

  recipe(input?: string | string[], output?: string): void {
    this.init(input, output);

    this.handleStyle(this.name, this.output);
  }

  fn = (cb: Function): void => {
    this.recipe();
    cb();
  };
}

export = PostcssTask;
