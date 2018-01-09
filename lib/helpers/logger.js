import colors from 'ansi-colors';
import fancyLog from 'fancy-log';

/**
 * Log type
 */
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
      content = JSON.stringify(content, null, 4);
      fancyLog('%s:\n%s', title, content);
    } else {
      fancyLog(`${title}`);
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
