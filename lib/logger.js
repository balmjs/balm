/**
 * log type
 */
const COLORS = {
  success: 'green',
  info: 'cyan',
  warning: 'yellow',
  danger: 'red'
};

const log = (title, content = '') => {
  if (config.debug) {
    if (content) {
      content = JSON.stringify(content, null, 4);
      $.util.log('%s:\n%s', title, content);
    } else {
      $.util.log(title);
    }
    $.util.log('\n');
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

const warning = (title, content) => {
  title = $.util.colors[COLORS.warning](title);
  log(title, content);
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
