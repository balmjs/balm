import workboxBuild from 'workbox-build';

class PwaTask extends BalmTask {
  constructor(mode = '') {
    super('pwa');

    this.mode = mode || config.pwa.mode;
  }

  get fn() {
    return () => {
      const swDest = `${config.roots.target}/sw.js`;
      let options = {};

      switch (this.mode) {
        // For basic
        case 'generateSW':
          options = Object.assign(
            {
              swDest,
              clientsClaim: true,
              exclude: [/\.map$/, /asset-manifest\.json$/],
              importWorkboxFrom: 'cdn',
              navigateFallback: path.join(
                config.assets.publicUrl,
                'index.html'
              ),
              navigateFallbackBlacklist: [
                // Exclude URLs starting with /_, as they're likely an API call
                new RegExp('^/_'),
                // Exclude URLs containing a dot, as they're likely a resource in
                // public/ and not a SPA route
                new RegExp('/[^/]+\\.[^/]+$')
              ],
              globDirectory: config.roots.target
            },
            config.pwa.options
          );
          break;
        // For advanced
        case 'injectManifest':
          options = Object.assign(
            {
              swSrc: `${config.roots.source}/service-worker.js`,
              swDest,
              globDirectory: config.roots.target,
              globPatterns: ['**/*.{html,ico,css,js,img,font,media}']
            },
            config.pwa.options
          );
          break;
        default:
      }

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
