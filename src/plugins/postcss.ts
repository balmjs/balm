import atImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

function getDefaultPostcssPlugins(): any[] {
  const defaultPostcssPlugins =
    BalmJS.config.styles.extname === 'css'
      ? [
          atImport({ path: BalmJS.file.stylePaths() }),
          postcssPresetEnv(BalmJS.config.styles.postcssEnvOptions),
          autoprefixer()
        ]
      : [autoprefixer()];

  return defaultPostcssPlugins.concat(BalmJS.config.styles.postcssPlugins);
}

export default getDefaultPostcssPlugins;
