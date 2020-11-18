import workboxBuild from 'workbox-build';

class PwaTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa');
  }

  recipe(customMode?: string, customOptions: object = {}): Function {
    const balmPwa = async (callback: Function): Promise<void> => {
      const mode: string = customMode || BalmJS.config.pwa.mode;

      let options: object = {};
      const globDirectory: string = BalmJS.config.dest.base;
      const swDest = BalmJS.file.absPath(
        `${globDirectory}/${BalmJS.config.pwa.swDestFilename}`
      );
      const swSrc = BalmJS.file.absPath(
        `${BalmJS.config.src.base}/${BalmJS.config.pwa.swSrcFilename}`
      );

      let valid = true;
      switch (mode) {
        // For basic
        case 'generateSW':
          options = Object.assign(
            {
              globDirectory,
              swDest
            },
            BalmJS.config.pwa.options,
            customOptions
          );
          break;
        // For advanced
        case 'injectManifest':
          options = Object.assign(
            {
              globDirectory,
              swDest,
              swSrc
            },
            BalmJS.config.pwa.options,
            customOptions
          );
          break;
        default:
          valid = false;
      }

      if (valid) {
        BalmJS.logger.debug(`pwa - ${mode}`, options, {
          pre: true
        });

        await workboxBuild[mode](options)
          .then(
            ({
              count,
              size
            }: {
              count: number;
              filePaths?: string[];
              size: number;
              warnings?: string[];
            }) => {
              BalmJS.logger.info(
                `pwa - ${mode}`,
                `Generated '${swDest}', which will precache ${count} files, totaling ${size} bytes`
              );

              gulp.parallel(BalmJS.toNamespace('pwa-cache') as string)();
            }
          )
          .catch((err: string) => {
            BalmJS.logger.warn(
              `pwa - ${mode}`,
              `Service worker generation failed: ${err}`
            );
          });

        callback();
      } else {
        BalmJS.logger.warn('pwa task', 'Invalid PWA mode');

        callback();
      }
    };

    return balmPwa;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default PwaTask;
