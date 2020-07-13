import { LooseObject } from '@balm-types/index';

const docsBaseURL = 'https://balmjs.com/docs/v2/config';

function upgradeGuide(key: string, value: string, message: string) {
  return `${message} See ${docsBaseURL}/${key}.html#${key}-${value}`;
}

// Compatibility for upgrade balm
function checkConfig(): void {
  // v2.22.0
  if ((BalmJS.config.images as LooseObject).defaultPlugins) {
    BalmJS.logger.warn(
      'balm@2.22.0+ config',
      upgradeGuide(
        'images',
        'plugins',
        '`images.defaultPlugins` was renamed to `images.plugins`.'
      )
    );
  }

  // v2.11.0
  if ((BalmJS.config.styles as LooseObject).postcssLoaderOptions) {
    BalmJS.logger.warn(
      'balm@2.11.0+ config',
      upgradeGuide(
        'scripts',
        'postcssLoaderOptions',
        '`styles.postcssLoaderOptions` was migrated to `scripts.postcssLoaderOptions`.'
      )
    );
  }

  // v2.5.0
  if ((BalmJS.config.scripts as LooseObject).disableDefaultLoaders) {
    BalmJS.logger.warn(
      'balm@2.5.0+ config',
      upgradeGuide(
        'scripts',
        'defaultLoaders',
        '`scripts.disableDefaultLoaders` was renamed to `scripts.defaultLoaders`.'
      )
    );
  }
}

export default checkConfig;
