import postcss from './postcss';
import plumber from './plumber';
import htmlmin from './htmlmin';
import jsmin from './jsmin';
import rename from './rename';
import sftp from './sftp';

const plugins: any = {
  postcss,
  plumber,
  htmlmin,
  jsmin,
  rename,
  sftp
};

BalmJS.plugins = plugins;
