import htmlmin from './htmlmin.js';
import imagemin from './imagemin.js';
import jsmin from './jsmin.js';
import plumber from './plumber.js';
import postcss from './postcss.js';
import rename from './rename.js';
import replace from './replace.js';
import sftp from './sftp.js';

const plugins: any = {
  htmlmin,
  imagemin,
  jsmin,
  plumber,
  postcss,
  rename,
  replace,
  sftp
};

BalmJS.plugins = plugins;
