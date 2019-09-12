import atImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

function getPostcssPlugins(): any[] {
  const postcssDefaultPlugins =
    BalmJS.config.styles.extname === 'css'
      ? [
          atImport({ path: BalmJS.file.stylePaths() }),
          postcssPresetEnv(BalmJS.config.styles.postcssEnvOptions),
          autoprefixer()
        ]
      : [autoprefixer()];

  return postcssDefaultPlugins.concat(BalmJS.config.styles.postcssPlugins);
}

export default getPostcssPlugins;
