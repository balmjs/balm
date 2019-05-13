import workboxBuild from 'workbox-build';

class PwaTask extends BalmTask {
  constructor(mode = '') {
    super('pwa');

    this.mode = mode || config.pwa.mode;
    this.output = config.isProd ? config.roots.target : config.roots.tmp;
  }

  get fn() {
    return () => {
      const swSrc = `${config.roots.source}/service-worker.js`;
      const swDest = `${this.output}/sw.js`;

      let options = {};

      switch (this.mode) {
        // For basic
        case 'generateSW':
          options = Object.assign(
            {
              swDest,
              importWorkboxFrom: 'disabled',
              importScripts: ['workbox-sw.js'],
              globDirectory: this.output
            },
            config.pwa.options
          );
          break;
        // For advanced
        case 'injectManifest':
          options = Object.assign(
            {
              swSrc,
              swDest,
              globDirectory: this.output
            },
            config.pwa.options
          );
          break;
        default:
      }

      logger.info('[PWA]', options);

      return workboxBuild[this.mode](options)
        .then(({ count, size }) => {
          console.log(
            `Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`
          );
        })
        .catch(error => {
          console.warn(`Service worker generation failed: ${error}`);
        });
    };
  }
}

export default PwaTask;
