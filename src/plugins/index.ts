import postcss from './postcss';
import sftp from './sftp';

const plugins: object = {
  postcss,
  sftp
};

BalmJS.plugins = plugins;
