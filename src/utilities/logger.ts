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
  static debug(obj: any, format = false): void {
    fancyLog(
      '%s %s',
      LOG.PREFIX,
      format
        ? util.inspect(
            obj,
            Object.assign(
              {
                showHidden: false,
                depth: 2,
                colors: true
              },
              BalmJS.config.log.formatOptions
            )
          )
        : obj
    );
  }

  static success(label: string, message: string): void {
    fancyLog(LOG.FORMAT, LOG.PREFIX, color(label, LOG.OK), message);
  }

  static info(label: string, message: string): void {
    fancyLog.info(LOG.FORMAT, LOG.PREFIX, color(label, LOG.INFO), message);
  }

  static warn(label: string, message: string): void {
    fancyLog.warn(LOG.FORMAT, LOG.PREFIX, color(label, LOG.WARN), message);
  }

  static error(label: string, message: string): void {
    fancyLog.error(LOG.FORMAT, LOG.PREFIX, color(label, LOG.ERROR), message);
  }
}

BalmJS.logger = Logger;

export default Logger;
