import postcssPresetEnv from 'postcss-preset-env';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

function getDefaultPostcssPlugins(): object[] {
  const defaultPostcssPlugins =
    BalmJS.config.styles.extname === 'css'
      ? [
          postcssPresetEnv(BalmJS.config.styles.postcssEnvOptions),
          atImport({ path: BalmJS.file.stylePaths })
        ]
      : [];

  return defaultPostcssPlugins.concat([
    autoprefixer(),
    ...BalmJS.config.styles.postcssPlugins
  ]);
}

export default getDefaultPostcssPlugins;
