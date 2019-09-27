import postcss from './postcss';
import plumber from './plumber';
import htmlmin from './htmlmin';
import rename from './rename';
import sftp from './sftp';
import { BalmPlugins } from '../config/types';

const plugins: BalmPlugins = {
  postcss,
  plumber,
  htmlmin,
  rename,
  sftp
};

BalmJS.plugins = plugins;
