class BalmTask {
  private _name: string;
  private _taskName: string;

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

BalmJS.BalmTask = BalmTask;

export default BalmTask;
