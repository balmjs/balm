import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import cssnext from 'postcss-cssnext';

const getPostcssPlugins = () => {
  let postcssDefaultPlugins =
    config.styles.ext === 'css'
      ? [
          atImport({ path: File.stylePaths() }),
          cssnext({ browsers: config.styles.autoprefixer })
        ]
      : [autoprefixer({ browsers: config.styles.autoprefixer })];

  return postcssDefaultPlugins.concat(config.styles.postcssPlugins);
};

export default getPostcssPlugins;
