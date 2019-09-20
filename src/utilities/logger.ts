import util from 'util';
import fancyLog from 'fancy-log';
import color from './color';
import { LogOptions } from '../config/types';

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
  },
  beginning: '$'.padStart(36, '*'),
  end: '^'.padEnd(36, '.')
};

class Logger {
  private _log(obj: any, pre = false): any {
    return pre
      ? util.inspect(
          obj,
          Object.assign(
            {
              showHidden: false,
              depth: 2,
              colors: true
            },
            BalmJS.config.logs.formatOptions
          )
        )
      : obj;
  }

  debug(obj: any, pre?: boolean): void {
    fancyLog('%s %s', LOG.PREFIX, this._log(obj, pre));
  }

  success(label: string, message: any, options: object = {}): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Debug
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      console.log(LOG.beginning);
      fancyLog(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.OK),
        this._log(message, logOptions.pre)
      );
      console.log(LOG.end);
    }
  }

  info(label: string, message: any, options: object = {}): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Info
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      fancyLog.info(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.INFO),
        this._log(message, logOptions.pre)
      );
    }
  }

  warn(label: string, message: any, options: object = {}): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Warn
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      fancyLog.warn(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.WARN),
        this._log(message, logOptions.pre)
      );
    }
  }

  error(label: string, message: any, options: object = {}): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Error
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      fancyLog.error(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.ERROR),
        this._log(message, logOptions.pre)
      );
    }
  }
}

export default new Logger();
