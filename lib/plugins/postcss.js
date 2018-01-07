import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import cssnext from 'postcss-cssnext';

const postcssDefaultPlugins =
  config.styles.ext === 'css'
    ? [
        atImport({ path: File.stylePaths() }),
        cssnext({ browsers: config.styles.autoprefixer })
      ]
    : [autoprefixer({ browsers: config.styles.autoprefixer })];

const postcssPlugins = postcssDefaultPlugins.concat(
  config.styles.postcssPlugins
);

export default postcssPlugins;
