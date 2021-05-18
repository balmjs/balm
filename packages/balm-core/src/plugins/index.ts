import htmlmin from './htmlmin';
import imagemin from './imagemin';
import jsmin from './jsmin';
import less from './less';
import plumber from './plumber';
import postcss from './postcss';
import postcssPlugins from './postcss-plugins';
import rename from './rename';
import replace from './replace';
import sass from './sass';
import sftp from './sftp';

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
