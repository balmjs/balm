import util from 'util';
import colors from 'ansi-colors';
import fancyLog from 'fancy-log';
import { isString } from '.';

const LOG_PREFIX = colors.bgBlueBright('BalmJS');
const LOG_COLORS = [
  ['success', 'greenBright'],
  ['info', 'cyanBright'],
  ['warning', 'yellowBright'],
  ['danger', 'redBright']
];

class BalmLogger {
  constructor() {
    this.colorsMap = new Map(LOG_COLORS);
  }

  log(title, content, debug = false) {
    if (debug) {
      if (content) {
        let message = isString(content)
          ? content
          : util.inspect(content, {
              showHidden: false,
              depth: 7,
              colors: true
            });
        fancyLog('%s %s: %s', LOG_PREFIX, title, message);
      } else {
        fancyLog(`%s ${title}`, LOG_PREFIX);
      }
    }
  }

  debug(title, content = '') {
    this.log(title, content, config.debug);
  }

  success(title, content = '', debug = config.debug) {
    title = colors[this.colorsMap.get('success')](title);
    this.log(title, content, debug);
  }

  info(title, content = '', debug = config.debug) {
    title = colors[this.colorsMap.get('info')](title);
    this.log(title, content, debug);
  }

  warn(title, content = '', debug = true) {
    title = colors[this.colorsMap.get('warning')](title);
    this.log(title, content, debug);
  }

  error(title, content = '', debug = true) {
    title = colors[this.colorsMap.get('danger')](title);
    this.log(title, content, debug);
  }
}

export default BalmLogger;
