import { watch } from 'gulp';
import BalmStyleTask from '../style';
import getMiddleware from '../../middlewares';
import { mergeDeep } from '../../utilities';

const reload = done => {
  browserSync.reload();
  done();
};

class ServerTask extends BalmStyleTask {
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
      parallel(toNamespace(this.styleTaskName))
    );
    if (config.scripts.entry && !config.scripts.hot) {
      watch(`${config.source.js}/**/*`, series(toNamespace('scripts'), reload));
    }

    watch(`${config.source.base}/*.html`, parallel(toNamespace('html'))).on(
      'change',
      browserSync.reload
    );
    watch(`${config.source.font}/**/*`, parallel(toNamespace('fonts')));
    watch(
      `${config.workspace}/bower.json`,
      parallel(toNamespace(['wiredep', 'fonts']))
    );
  }

  get deps() {
    let tasks = ['html', this.styleTaskName, 'scripts', 'fonts'];

    if (!config.static) {
      tasks.shift();
      tasks = tasks.concat(['images', 'media']);
    }

    return tasks;
  }

  get fn() {
    return cb => {
      let bsOptions = {
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

      if (!config.test) {
        browserSync.init(bsOptions);

        this.onWatch();
      }

      cb();
    };
  }
}

export default ServerTask;
