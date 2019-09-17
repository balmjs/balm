import atImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

function getDefaultPostcssPlugins(): object[] {
  const defaultPostcssPlugins =
    BalmJS.config.styles.extname === 'css'
      ? [
          atImport({ path: BalmJS.file.stylePaths() }),
          postcssPresetEnv(BalmJS.config.styles.postcssEnvOptions),
          autoprefixer(),
          ...BalmJS.config.styles.postcssPlugins
        ]
      : [autoprefixer()];

  return defaultPostcssPlugins;
}

export default getDefaultPostcssPlugins;
