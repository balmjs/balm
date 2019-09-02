import util from 'util';
import fancyLog from 'fancy-log';
import color from './color';

const LOG = {
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
  static debug(obj: any, format: boolean = false): void {
    fancyLog(
      '%s %s',
      LOG.PREFIX,
      format
        ? util.inspect(obj, {
            depth: 4,
            colors: true
          })
        : obj
    );
  }

  static success(label: string, message: string): void {
    fancyLog('%s %s %s', LOG.PREFIX, color(label, LOG.OK), message);
  }

  static info(label: string, message: string): void {
    fancyLog.info('%s %s %s', LOG.PREFIX, color(label, LOG.INFO), message);
  }

  static warn(label: string, message: string): void {
    fancyLog.warn('%s %s %s', LOG.PREFIX, color(label, LOG.WARN), message);
  }

  static error(label: string, message: string): void {
    fancyLog.error('%s %s %s', LOG.PREFIX, color(label, LOG.ERROR), message);
  }
}

export default Logger;
