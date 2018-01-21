import util from 'util';
import colors from 'ansi-colors';
import fancyLog from 'fancy-log';
import { isString } from '.';

/**
 * Log type
 */
const NAMESPACE = colors.bgblue('BalmJS');
const COLORS = [
  ['success', 'green'],
  ['info', 'cyan'],
  ['warning', 'yellow'],
  ['danger', 'red']
];

let colorsMap = new Map(COLORS);

const log = (title, content = '', flag = false) => {
  if (config.debug || flag) {
    if (content) {
      let message = isString(content)
        ? content
        : util.inspect(content, {
            showHidden: false,
            depth: 8,
            colors: true
          });
      fancyLog('%s %s:\n%s', NAMESPACE, title, message);
    } else {
      fancyLog(`%s ${title}`, NAMESPACE);
    }
  }
};

const success = (title, content) => {
  title = colors[colorsMap.get('success')](title);
  log(title, content);
};

const info = (title, content) => {
  title = colors[colorsMap.get('info')](title);
  log(title, content);
};

const warning = (title, content, flag = false) => {
  title = colors[colorsMap.get('warning')](title);
  log(title, content, flag);
};

const error = (title, content, flag = false) => {
  title = colors[colorsMap.get('danger')](title);
  log(title, content, flag);
};

export default {
  log: fancyLog,
  success,
  info,
  warning,
  error
};
