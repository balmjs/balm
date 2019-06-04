const getPostcssPlugins = () => {
  let postcssPresetEnvOptions = config.styles.postcssEnvOptions;

  let postcssDefaultPlugins =
    config.styles.ext === 'css'
      ? [
          require('postcss-import')({ path: BalmFile.stylePaths() }),
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')(postcssPresetEnvOptions),
          require('autoprefixer')()
        ]
      : [require('autoprefixer')()];

  return postcssDefaultPlugins.concat(config.styles.postcssPlugins);
};

export default getPostcssPlugins;
