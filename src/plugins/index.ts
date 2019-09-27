import postcss from './postcss';
import rename from './rename';
import sftp from './sftp';
import { BalmPlugins } from '../config/types';

const plugins: BalmPlugins = {
  postcss,
  rename,
  sftp
};

BalmJS.plugins = plugins;
