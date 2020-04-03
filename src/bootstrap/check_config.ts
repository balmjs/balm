const docsBaseURL = 'https://balmjs.com/docs/v2/config';

// Compatibility for upgrade balm
function checkConfig(): void {
  // v2.11.0
  if (BalmJS.config.styles.postcssLoaderOptions) {
    BalmJS.logger.warn(
      'balm@2.11.0+ config',
      `'styles.postcssLoaderOptions' was migrated to 'scripts.postcssLoaderOptions'. See ${docsBaseURL}/scripts.html#scripts-postcssloaderoptions`
    );
  }

  // v2.5.0
  if (BalmJS.config.scripts.disableDefaultLoaders) {
    BalmJS.logger.warn(
      'balm@2.5.0+ config',
      `'scripts.disableDefaultLoaders' was renamed to 'scripts.defaultLoaders'. See ${docsBaseURL}/scripts.html#scripts-defaultloaders`
    );
  }
}

export default checkConfig;
