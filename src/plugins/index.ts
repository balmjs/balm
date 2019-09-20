import postcss from './postcss';
import rename from './rename';
import sftp from './sftp';

const plugins: object = {
  postcss,
  rename,
  sftp
};

BalmJS.plugins = plugins;
