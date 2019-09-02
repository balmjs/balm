import fancyLog from 'fancy-log';
import color from './color';

const LOG = {
  OK: {
    color: 'green',
    symbol: 'check'
  },
  INFO: {
    color: 'blue',
    symbol: 'info'
  },
  WARN: {
    color: 'yellow',
    symbol: 'warning'
  },
  ERROR: {
    color: 'red',
    symbol: 'cross'
  }
};

class Logger {
  static debug(msg: string): void {
    fancyLog(msg);
  }

  static success(msg: string): void {
    fancyLog(color(msg, LOG.OK));
  }

  static info(msg: string): void {
    fancyLog.info(color(msg, LOG.INFO));
  }

  static dir(obj: object): void {
    fancyLog.dir(obj);
  }

  static warn(msg: string): void {
    fancyLog.warn(color(msg, LOG.WARN));
  }

  static error(msg: string): void {
    fancyLog.error(color(msg, LOG.ERROR));
  }
}

export default Logger;
