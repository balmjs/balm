import util from 'node:util';
import fancyLog from 'fancy-log';
import color from './color.js';

interface LogOptions {
  logLevel: number;
  pre?: boolean;
}

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
  DEBUG: {
    color: 'blue',
    bright: true,
    symbol: 'mark'
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
  #log = (obj: any, pre = false): string => {
    const options: {
      showHidden: boolean;
      depth: number;
      colors: boolean;
    } = Object.assign(
      {
        showHidden: false,
        depth: 2,
        colors: true
      },
      BalmJS.config.logs.formatOptions
    );

    return pre ? util.inspect(obj, options) : (obj as string);
  };

  success(
    label: string,
    message: any,
    options: Partial<LogOptions> = {}
  ): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Trace
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      console.log(LOG.beginning);
      fancyLog(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.OK),
        this.#log(message, logOptions.pre)
      );
      console.log(LOG.end);
    }
  }

  debug(label: string, message: any, options: Partial<LogOptions> = {}): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Debug
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      fancyLog.info(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.DEBUG),
        this.#log(message, logOptions.pre)
      );
    }
  }

  info(label: string, message: any, options: Partial<LogOptions> = {}): void {
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
        this.#log(message, logOptions.pre)
      );
    }
  }

  warn(label: string, message: any, options: Partial<LogOptions> = {}): void {
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
        this.#log(message, logOptions.pre)
      );
    }
  }

  error(label: string, message: any, options: Partial<LogOptions> = {}): void {
    const logOptions: LogOptions = Object.assign(
      {
        logLevel: BalmJS.LogLevel.Error,
        pre: false
      },
      options
    );

    if (BalmJS.config.logs.level <= logOptions.logLevel) {
      fancyLog.error(
        LOG.FORMAT,
        LOG.PREFIX,
        color(`<${label}>`, LOG.ERROR),
        this.#log(message, logOptions.pre)
      );
    }
  }
}

export default new Logger();
