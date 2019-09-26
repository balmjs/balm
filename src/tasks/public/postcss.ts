class PostcssTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('postcss');
  }

  recipe(input?: string | string[], output?: string): any {
    this.init(input, output);

    return this.handleStyle(this.name, this.output);
  }

  fn = (): any => {
    return this.recipe();
  };
}

export default PostcssTask;
