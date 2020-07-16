import postcssPresetEnv from 'postcss-preset-env';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

function getDefaultPostcssPlugins(isPostCSS: boolean = false): object[] {
  const defaultPostcssPlugins =
    isPostCSS || BalmJS.config.styles.extname === 'css'
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
