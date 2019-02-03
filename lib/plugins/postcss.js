import autoprefixer from 'autoprefixer';
import atImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';

const getPostcssPlugins = () => {
  let postcssDefaultPlugins =
    config.styles.ext === 'css'
      ? [
          atImport({ path: BalmFile.stylePaths() }),
          postcssPresetEnv({ stage: 0, browsers: config.styles.autoprefixer })
        ]
      : [autoprefixer({ browsers: config.styles.autoprefixer })];

  return postcssDefaultPlugins.concat(config.styles.postcssPlugins);
};

export default getPostcssPlugins;
