import colors from 'ansi-colors';

function getMessage(msg) {
  return colors.yellow(msg);
}

export const title = colors.bgBlueBright('BalmJS');
export const message = {
  outdated: getMessage('A newer version of `balm-core` is available.'),
  config: getMessage('`config` is required'),
  notFound: getMessage('`balm.config.js` not found :('),
  binCommand: getMessage(
    'Only `balm` or `balm --production` can be run in the project'
  )
};
