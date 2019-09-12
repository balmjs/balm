import BalmTask from './balm';

class BalmImageTask extends BalmTask {
  constructor(name: string) {
    super(name);

    this.defaultOutput =
      BalmJS.config.env.isProd || !BalmJS.config.inFrontend
        ? BalmJS.config.target.img
        : BalmJS.config.tmp.img;
  }
}

export default BalmImageTask;
