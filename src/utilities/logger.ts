import util from 'util';
import fancyLog from 'fancy-log';
import color from './color';

const LOG = {
  FORMAT: '%s %s %s',
  PREFIX: color('BalmJS', {
    color: 'blue',
    background: true,
    bright: true
  }),
  OK: {
    color: 'green',
    bright: true,
    symbol: 'check'
  },
  INFO: {
    color: 'cyan',
    bright: true,
    symbol: 'info'
  },
  WARN: {
    color: 'yellow',
    bright: true,
    symbol: 'warning'
  },
  ERROR: {
    color: 'red',
    bright: true,
    symbol: 'cross'
  }
};

class Logger {
  private _log(obj: any): any {
    return util.inspect(
      obj,
      Object.assign(
        {
          showHidden: false,
          depth: 2,
          colors: true
        },
        BalmJS.config.logs.formatOptions
      )
    );
  }

  debug(obj: any): void {
    fancyLog('%s %s', LOG.PREFIX, this._log(obj));
  }

  success(label: string, message: any): void {
    fancyLog(LOG.FORMAT, LOG.PREFIX, color(label, LOG.OK), this._log(message));
  }

  info(label: string, message: any): void {
    fancyLog.info(
      LOG.FORMAT,
      LOG.PREFIX,
      color(label, LOG.INFO),
      this._log(message)
    );
  }

  warn(label: string, message: any): void {
    fancyLog.warn(
      LOG.FORMAT,
      LOG.PREFIX,
      color(label, LOG.WARN),
      this._log(message)
    );
  }

  error(label: string, message: any): void {
    fancyLog.error(
      LOG.FORMAT,
      LOG.PREFIX,
      color(label, LOG.ERROR),
      this._log(message)
    );
  }
}

export default new Logger();
