import workboxBuild from 'workbox-build';

class PwaTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa');
  }

  recipe(customMode?: string, customOptions: object = {}): any {
    return async (cb: Function): Promise<any> => {
      const mode = customMode || BalmJS.config.pwa.mode;
      const globDirectory = BalmJS.config.dest.base;
      const swSrc = `${BalmJS.config.roots.source}/${BalmJS.config.pwa.swSrcFilename}`;
      const swDest = `${globDirectory}/${BalmJS.config.pwa.swDestFilename}`;
      let options = {};

      switch (mode) {
        // For basic
        case 'generateSW':
          options = Object.assign(
            {
              swDest,
              importWorkboxFrom: 'disabled',
              importScripts: ['workbox-sw.js'],
              globDirectory
            },
            BalmJS.config.pwa.options,
            customOptions
          );
          break;
        // For advanced
        case 'injectManifest':
          options = Object.assign(
            {
              swSrc,
              swDest,
              globDirectory
            },
            BalmJS.config.pwa.options,
            customOptions
          );
          break;
        default:
      }

      BalmJS.logger.debug(`pwa - ${mode}`, options);

      await workboxBuild[mode](options)
        .then(function(result: any) {
          BalmJS.logger.info(
            `pwa - ${mode}`,
            `Generated '${swDest}', which will precache ${result.count} files, totaling ${result.size} bytes`
          );
        })
        .catch(function(error: any) {
          BalmJS.logger.warn(
            `pwa - ${mode}`,
            `Service worker generation failed: ${error}`
          );
        });

      cb();
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default PwaTask;
