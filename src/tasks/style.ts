abstract class StyleTask extends BalmJS.BalmTask {
  private _styleName: string;

  constructor(name: string) {
    super(name);
    this._styleName = name;
  }

  get styleName(): string {
    return this._styleName;
  }

  // handleStyle() {}

  // errorHandler() {}
}

export default StyleTask;
