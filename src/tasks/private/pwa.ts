import workboxBuild from 'workbox-build';

class PwaTask extends BalmJS.BalmTask {
  constructor() {
    super('pwa');

    this.defaultInput = BalmJS.config.roots.source;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  get options(): any {
    const swSrc = `${this.input}/service-worker.js`;
    const swDest = `${this.output}/sw.js`;
    let swOptions = {};

    switch (BalmJS.config.pwa.mode) {
      // For basic
      case 'generateSW':
        swOptions = Object.assign(
          {
            swDest,
            importWorkboxFrom: 'disabled',
            importScripts: ['workbox-sw.js'],
            globDirectory: this.output
          },
          BalmJS.config.pwa.options
        );
        break;
      // For advanced
      case 'injectManifest':
        swOptions = Object.assign(
          {
            swSrc,
            swDest,
            globDirectory: this.output
          },
          BalmJS.config.pwa.options
        );
        break;
      default:
    }

    return swOptions;
  }

  fn(): void {
    this.init();

    const mode = BalmJS.config.pwa.mode;
    const swDest = `${this.output}/sw.js`;

    BalmJS.logger.info('pwa', this.options);

    return workboxBuild[mode](this.options)
      .then((result: any) => {
        BalmJS.logger.success(
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
  }
}

export default PwaTask;
