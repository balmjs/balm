import BalmTask from './balm';

class BalmImageTask extends BalmTask {
  constructor(name: string) {
    super(name);

    this.defaultOutput = BalmJS.config.dest.img;
  }
}

export default BalmImageTask;
