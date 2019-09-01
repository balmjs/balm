import fancyLog from 'fancy-log';
import color from './color';

class Logger {
  static debug(str: string): void {
    fancyLog(str);
  }

  static success(str: string): void {
    fancyLog(
      color(str, {
        color: 'green',
        symbol: 'check'
      })
    );
  }

  static info(str: string): void {
    fancyLog.info(
      color(str, {
        color: 'blue',
        symbol: 'info'
      })
    );
  }

  static dir(str: string): void {
    fancyLog(str);
  }

  static warn(str: string): void {
    fancyLog.warn(
      color(str, {
        color: 'yellow',
        symbol: 'warning'
      })
    );
  }

  static error(str: string): void {
    fancyLog.error(
      color(str, {
        color: 'red',
        symbol: 'cross'
      })
    );
  }
}

export default Logger;
