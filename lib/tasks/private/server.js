import { watch } from 'gulp';
import BalmStyleTask from '../style';
import getMiddleware from '../../middlewares';
import { mergeDeep } from '../../utilities';

const reload = done => {
  server.reload();
  done();
};

class ServerTask extends BalmStyleTask {
  constructor() {
    super('serve');
  }

  onWatch() {
    // NOTE: bugfix for windows - chokidar.cwd has not default
    const watchOptions = {
      cwd: config.workspace
    };

    watch(
      [
        `${config.source.base}/*.php`,
        `${config.source.img}/**/*`,
        `${config.tmp.font}/**/*`
      ],
      watchOptions
    ).on('change', server.reload);

    watch(
      `${config.source.css}/**/*.${config.styles.ext}`,
      watchOptions,
      parallel(toNamespace(this.styleTaskName))
    );
    if (config.scripts.entry && !config.scripts.hot) {
      watch(
        `${config.source.js}/**/*`,
        watchOptions,
        series(toNamespace('scripts'), reload)
      );
    }

    watch(
      `${config.source.base}/*.html`,
      watchOptions,
      parallel(toNamespace('html'))
    ).on('change', server.reload);
    watch(
      `${config.source.font}/**/*`,
      watchOptions,
      parallel(toNamespace('fonts'))
    );
    watch(
      `${config.workspace}/bower.json`,
      watchOptions,
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

      if (config.isDev) {
        server.init(bsOptions);

        this.onWatch();
      }

      cb();
    };
  }
}

export default ServerTask;
