class Balm {
  private _config: any;
  private _logger: any;

  get config(): any {
    return this._config;
  }
  set config(value: any) {
    this._config = value;
  }

  get logger(): any {
    return this._logger;
  }
  set logger(value: any) {
    this._logger = value;
  }
}

const balm = new Balm();
global.BalmJS = balm;
