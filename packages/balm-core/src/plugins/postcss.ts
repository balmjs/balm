function getDefaultPostcssPlugins(isPostCSS = false): object[] {
  const postcssPresetEnv = requireModule('postcss-preset-env');
  const atImport = requireModule('postcss-import');
  const autoprefixer = requireModule('autoprefixer');
  const cssnano = requireModule('cssnano');

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
