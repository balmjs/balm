import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import {stylePaths} from '../helpers/index';

const postcssDefaultPlugins = (config.styles.ext === 'css')
  ? [
    atImport({path: stylePaths()}),
    cssnext({browsers: config.styles.autoprefixer})
  ]
  : [autoprefixer({browsers: config.styles.autoprefixer})];

const postcssPlugins = postcssDefaultPlugins.concat(config.styles.postcss.plugins);

export default postcssPlugins;
