import postcssPresetEnv from 'postcss-preset-env';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

function getDefaultPostcssPlugins(isPostCSS = false): object[] {
  const defaultPostcssPlugins =
    isPostCSS || BalmJS.config.styles.extname === 'css'
      ? [
          postcssPresetEnv(BalmJS.config.styles.postcssEnvOptions),
          atImport({ path: BalmJS.file.stylePaths })
        ]
      : [];

  const cssnanoPlugin =
    BalmJS.config.env.isProd || BalmJS.config.styles.minify
      ? [
          cssnano(
            Object.assign(BalmJS.config.styles.options, {
              autoprefixer: false
            })
          )
        ]
      : [];

  return defaultPostcssPlugins.concat([
    autoprefixer(),
    ...cssnanoPlugin,
    ...BalmJS.config.styles.postcssPlugins
  ]);
}

export default getDefaultPostcssPlugins;
