import BalmTask from './balm';

class BalmImageTask extends BalmTask {
  constructor(name: string) {
    super(name);

    this.defaultOutput = BalmJS.config.to.img;
  }
}

export default BalmImageTask;
