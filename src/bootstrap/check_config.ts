import { LooseObject } from '@balm/index';

const docsBaseURL = 'https://balmjs.com/docs/v2/config';

// Compatibility for upgrade balm
function checkConfig(): void {
  // v2.22.0
  if ((BalmJS.config.images as LooseObject).defaultPlugins) {
    BalmJS.logger.warn(
      'balm@2.22.0+ config',
      `'images.defaultPlugins' was migrated to 'images.plugins'. See ${docsBaseURL}/images.html#images-plugins`
    );
  }

  // v2.11.0
  if ((BalmJS.config.styles as LooseObject).postcssLoaderOptions) {
    BalmJS.logger.warn(
      'balm@2.11.0+ config',
      `'styles.postcssLoaderOptions' was migrated to 'scripts.postcssLoaderOptions'. See ${docsBaseURL}/scripts.html#scripts-postcssloaderoptions`
    );
  }

  // v2.5.0
  if ((BalmJS.config.scripts as LooseObject).disableDefaultLoaders) {
    BalmJS.logger.warn(
      'balm@2.5.0+ config',
      `'scripts.disableDefaultLoaders' was renamed to 'scripts.defaultLoaders'. See ${docsBaseURL}/scripts.html#scripts-defaultloaders`
    );
  }
}

export default checkConfig;
