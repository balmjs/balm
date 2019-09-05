const TIME_FLAG = 'BalmJS Time';

class BalmTask {
  protected _name: string;
  protected _taskName: string;

  constructor(name: string) {
    this._name = name;
    this._taskName =
      name === 'default' ? name : (BalmJS.toNamespace(name) as string);
  }

  get name(): string {
    return this._name;
  }

  get taskName(): string {
    return this._taskName;
  }
}

class StyleTask extends BalmTask {
  constructor(name: string) {
    super(name);
  }

  // handleStyle() {}

  // handleError() {}
}

BalmJS.TIME_FLAG = TIME_FLAG;
BalmJS.BalmTask = BalmTask;
BalmJS.StyleTask = StyleTask;

export { BalmTask, StyleTask };
