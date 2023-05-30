import atImport from 'postcss-import';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

function getDefaultPostcssPlugins(
  isPostCSS = false,
  useTailwind = false
): object[] {
  const defaultPostcssPlugins =
    isPostCSS || BalmJS.config.styles.extname === 'css'
      ? [
          ...(useTailwind ? ['tailwindcss'] : []),
          atImport({ path: BalmJS.file.stylePaths }),
          postcssFlexbugsFixes(),
          postcssPresetEnv(BalmJS.config.styles.postcssEnvOptions)
        ]
      : [];

  const cssnanoPlugin =
    BalmJS.config.env.isProd || BalmJS.config.styles.minify
      ? [cssnano(BalmJS.config.styles.options)]
      : [];

  return defaultPostcssPlugins.concat([
    autoprefixer(),
    ...cssnanoPlugin,
    ...BalmJS.config.styles.postcssPlugins
  ]);
}

export default getDefaultPostcssPlugins;
