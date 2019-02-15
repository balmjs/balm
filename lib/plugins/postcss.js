const getPostcssPlugins = () => {
  let postcssPresetEnvOptions = config.styles.postcssEnvOptions;
  postcssPresetEnvOptions.browsers = config.styles.autoprefixer;

  let postcssDefaultPlugins =
    config.styles.ext === 'css'
      ? [
          require('postcss-import')({ path: BalmFile.stylePaths() }),
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')(postcssPresetEnvOptions)
        ]
      : [require('autoprefixer')({ browsers: config.styles.autoprefixer })];

  return postcssDefaultPlugins.concat(config.styles.postcssPlugins);
};

export default getPostcssPlugins;
