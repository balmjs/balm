import postcss from './postcss';
import htmlmin from './htmlmin';
import rename from './rename';
import sftp from './sftp';
import { BalmPlugins } from '../config/types';

const plugins: BalmPlugins = {
  htmlmin,
  postcss,
  rename,
  sftp
};

BalmJS.plugins = plugins;
