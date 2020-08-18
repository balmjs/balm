class PostcssTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('postcss');
  }

  recipe(input?: string | string[], output?: string): Function {
    const balmPostcss = (): any => {
      this.init(input, output);

      return this.handleStyle(this.name, this.output);
    };

    return balmPostcss;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default PostcssTask;
