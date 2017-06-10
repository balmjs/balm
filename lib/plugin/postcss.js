import atImport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import {stylePaths} from '../helper';

const postcssPlugins = [
  atImport({path: stylePaths()}),
  cssnext({browsers: config.styles.autoprefixer})
].concat(config.styles.postcss.plugins);

export default postcssPlugins;
