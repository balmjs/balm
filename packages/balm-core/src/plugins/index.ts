import htmlmin from './htmlmin.js';
import imagemin from './imagemin.js';
import jsmin from './jsmin.js';
import less from './less.js';
import plumber from './plumber.js';
import postcss from './postcss.js';
import postcssPlugins from './postcss-plugins.js';
import rename from './rename.js';
import replace from './replace.js';
import sass from './sass.js';
import sftp from './sftp.js';

const plugins: any = {
  htmlmin,
  imagemin,
  jsmin,
  less,
  plumber,
  postcss,
  postcssPlugins,
  rename,
  replace,
  sass,
  sftp
};

BalmJS.plugins = plugins;
