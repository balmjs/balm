class BalmTask {
  private _name: string;

  constructor(name: string) {
    this._name =
      name === 'default' ? name : (BalmJS.toNamespace(name) as string);
  }

  get name(): string {
    return this._name;
  }
}

BalmJS.BalmTask = BalmTask;

export default BalmTask;
