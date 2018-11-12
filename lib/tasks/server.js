import { watch } from 'gulp';
import getMiddleware from '../middlewares';
import { mergeDeep } from '../utilities';

class Server extends BalmTask {
  constructor() {
    super('serve');
  }

  onWatch() {
    watch([
      `${config.source.base}/*.php`,
      `${config.source.img}/**/*`,
      `${config.tmp.font}/**/*`
    ]).on('change', browserSync.reload);

    watch(
      `${config.source.css}/**/*.${config.styles.ext}`,
      parallel(getNamespace([this.getStyleTask()]))
    );
    if (config.scripts.entry && !config.scripts.hot) {
      watch(`${config.source.js}/**/*`, parallel(getNamespace(['webpack'])));
    }
    watch(`${config.source.base}/*.html`, parallel(getNamespace(['html']))).on(
      'change',
      browserSync.reload
    );
    watch(`${config.source.font}/**/*`, parallel(getNamespace(['fonts'])));
    watch(
      `${config.workspace}/bower.json`,
      parallel(getNamespace(['wiredep', 'fonts']))
    );
  }

  get deps() {
    let tasks = ['html', this.getStyleTask(), 'scripts', 'fonts'];

    if (!config.static) {
      tasks.concat(['images', 'media']);
    }

    return tasks;
  }

  get fn() {
    return () => {
      let bsOptions = {
        files: [
          `${config.source.js}/**/*`,
          {
            match: [`${config.source.css}/**/*.${config.styles.ext}`],
            fn: (event, file) => {
              logger.info(event, file);
              if (event === 'add') {
                watch(
                  BalmFile.absPaths(file),
                  parallel(getNamespace([this.getStyleTask()]))
                );
              }
            }
          }
        ],
        logPrefix: 'BalmJS',
        notify: false,
        https: config.server.https,
        host: config.server.host,
        port: config.server.port,
        open: config.server.open,
        browser: config.server.browser,
        reloadDelay: config.server.reloadDelay,
        localOnly: config.server.localOnly
      };

      if (config.server.proxy) {
        bsOptions.proxy = {
          target: config.server.proxy,
          middleware: getMiddleware() || undefined
        };
        bsOptions.serveStatic = config.server.serveStatic;
      } else {
        bsOptions.server = {
          baseDir: [config.tmp.base, config.source.base],
          routes: {
            '/bower_components': BalmFile.absPaths('bower_components'),
            '/node_modules': BalmFile.absPaths('node_modules')
          }
        };
        bsOptions.middleware = getMiddleware() || false;
      }

      bsOptions = mergeDeep(bsOptions, config.server.options);

      browserSync(bsOptions);

      this.onWatch();
    };
  }
}

export default Server;
