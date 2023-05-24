function getDefaultPostcssPlugins(
  isPostCSS = false,
  useTailwind = false
): object[] {
  const atImport = require('postcss-import');
  const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
  const postcssPresetEnv = require('postcss-preset-env');
  const autoprefixer = require('autoprefixer');
  const cssnano = require('cssnano');

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
