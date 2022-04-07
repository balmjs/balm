import { DOMAIN } from '../config/constants.js';
import { LooseObject } from '@balm-core/index';

const docsBaseURL = `${DOMAIN}/docs/config`;

function upgradeGuide(key: string, value: string, message: string) {
  const page = key === 'scripts' ? 'scripts-webpack' : key.toLowerCase();
  return `${message} See ${docsBaseURL}/${page}.html#${key}-${value.toLowerCase()}`;
}

function upgradeRenamed(
  version: string,
  configCategory: string,
  from: string,
  to: string
) {
  if ((BalmJS.config as LooseObject)[configCategory][from]) {
    BalmJS.logger.warn(
      `balm@${version}+ config`,
      upgradeGuide(
        configCategory,
        to,
        `'${configCategory}.${from}' was renamed to '${configCategory}.${to}'.`
      )
    );
  }
}

function upgradeMigrated(
  version: string,
  configName: string,
  from: string,
  to: string
) {
  if ((BalmJS.config as LooseObject)[from][configName]) {
    BalmJS.logger.warn(
      `balm@${version}+ config`,
      upgradeGuide(
        to,
        configName,
        `'${from}.${configName}' was migrated to '${to}.${configName}'.`
      )
    );
  }
}

function upgradeDeprecated(
  version: string,
  configCategory: string,
  configName: string
) {
  if ((BalmJS.config as LooseObject)[configCategory][configName]) {
    BalmJS.logger.warn(
      `balm@${version}+ config`,
      `'${configCategory}.${configName}' was deprecated.`
    );
  }
}

// Compatibility for upgrade balm
function checkConfig(): void {
  // For v2
  upgradeRenamed('2.5.0', 'scripts', 'disableDefaultLoaders', 'defaultLoaders');
  upgradeMigrated('2.11.0', 'postcssLoaderOptions', 'styles', 'scripts');
  upgradeRenamed('2.22.0', 'images', 'defaultPlugins', 'plugins');

  // For v3
  upgradeRenamed('3.0.0', 'styles', 'minified', 'minify');
  upgradeRenamed('3.9.0', 'scripts', 'options', 'minifyOptions');
  upgradeRenamed('3.16.0', 'scripts', 'inject', 'useCache');
  upgradeDeprecated('3.17.0', 'styles', 'darkSass');
  upgradeDeprecated('3.19.0', 'scripts', 'useCache');

  // For v4
  upgradeDeprecated('4.5.0', 'scripts', 'excludeUrlResource');
  upgradeDeprecated('4.5.0', 'scripts', 'urlLoaderOptions');
  upgradeDeprecated('4.5.0', 'scripts', 'extractCss');
}

export default checkConfig;
