import './config';
import './utilities/logger';

class Balm {
  private name: string;

  constructor(name: string) {
    this.name = name;
    global.BalmJS.config.log.formatOptions = {
      depth: 8
    };
  }

  public getName(): string {
    global.BalmJS.logger.debug(global.BalmJS.config);
    return this.name;
  }
}

export default Balm;
