class PostcssTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('postcss');
  }

  recipe(input?: string | string[], output?: string): void {
    this.init(input, output);

    this.handleStyle(this.name, this.output);
  }

  fn(): void {
    this.recipe();
  }
}

export default PostcssTask;
