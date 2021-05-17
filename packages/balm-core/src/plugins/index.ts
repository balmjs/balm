import htmlmin from './htmlmin';
import imagemin from './imagemin';
import jsmin from './jsmin';
import plumber from './plumber';
import postcss from './postcss';
import rename from './rename';
import replace from './replace';
import sass from './sass';
import sftp from './sftp';

const plugins: any = {
  htmlmin,
  imagemin,
  jsmin,
  plumber,
  postcss,
  rename,
  replace,
  sass,
  sftp
};

BalmJS.plugins = plugins;
