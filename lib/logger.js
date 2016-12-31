/**
 * log type
 */
const COLORS = {
  success: 'green',
  info: 'cyan',
  warning: 'yellow',
  danger: 'red'
};

const log = (title, content = '', flag = false) => {
  if (config.debug || flag) {
    if (content) {
      content = JSON.stringify(content, null, 4);
      $.util.log('%s:\n%s\n', title, content);
    } else {
      $.util.log(`${title}\n`);
    }
  }
};

const success = (title, content) => {
  title = $.util.colors[COLORS.success](title);
  log(title, content);
};

const info = (title, content) => {
  title = $.util.colors[COLORS.info](title);
  log(title, content);
};

const warning = (title, content, flag = false) => {
  title = $.util.colors[COLORS.warning](title);
  log(title, content, flag);
};

const error = (title, content) => {
  title = $.util.colors[COLORS.danger](title);
  log(title, content);
};

export default {
  log,
  success,
  info,
  warning,
  error
};
