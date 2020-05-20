import { series, parallel, watch } from 'gulp';
import detectPort from 'detect-port';
import getMiddlewares from '../../middlewares';

function reload(done: Function): void {
  server.reload();
  done();
}

class ServerTask extends BalmJS.BalmTask {
  constructor() {
    super('serve');

    if (BalmJS.config.scripts.ie8) {
      BalmJS.config.scripts.hot = false;
    }

    if (BalmJS.config.env.isDev) {
      detectPort(BalmJS.config.server.port)
        .then((port: number) => {
          if (BalmJS.config.server.port !== port) {
            BalmJS.logger.warn(
              'server task',
              `port: ${BalmJS.config.server.port} was occupied, try port: ${port}`
            );

            BalmJS.config.server.port = port;
          }
        })
        .catch((error: any) => {
          BalmJS.logger.error('server task', error);
        });
    }
  }

  private _onWatch(): void {
    // NOTE: bugfix for windows - chokidar.cwd has not default
    const watchOptions = {
      cwd: BalmJS.config.workspace
    };

    watch(
      [
        `${BalmJS.config.src.img}/**/*`,
        `${BalmJS.config.dest.font}/**/*`,
        ...BalmJS.config.server.extraWatchFiles
      ],
      watchOptions
    ).on('change', server.reload);

    watch(
      `${BalmJS.config.src.base}/*.html`,
      watchOptions,
      parallel(BalmJS.toNamespace('html'))
    ).on('change', server.reload);

    watch(
      `${BalmJS.config.src.css}/**/*.${BalmJS.config.styles.extname}`,
      watchOptions,
      parallel(
        BalmJS.toNamespace(BalmJS.config.inFrontend ? this.styleName : 'style')
      )
    );

    if (BalmJS.config.scripts.entry && !BalmJS.config.scripts.hot) {
      watch(
        `${BalmJS.config.src.js}/**/*`,
        watchOptions,
        series(BalmJS.toNamespace('script'), reload)
      );
    }

    watch(
      `${BalmJS.config.src.base}/modernizr.json`,
      watchOptions,
      parallel(BalmJS.toNamespace('modernizr'))
    );

    watch(
      `${BalmJS.config.src.font}/**/*`,
      watchOptions,
      parallel(BalmJS.toNamespace('font'))
    );

    // For FTP
    if (BalmJS.config.ftp.watchFiles.length) {
      watch(BalmJS.config.ftp.watchFiles, watchOptions).on(
        'change',
        (path: string) => {
          BalmJS.logger.debug(`${this.name} task`, `File ${path} was changed`);
          BalmJS.watchFtpFile = path;
          series(BalmJS.toNamespace('ftp'), reload)();
        }
      );
    }
  }

  recipe(customHandler?: Function): any {
    return (cb: Function): void => {
      if (BalmJS.server) {
        BalmJS.logger.warn('server task', 'The server has started');
      } else {
        let bsOptions: any = {
          logPrefix: 'BalmJS',
          notify: false,
          port: BalmJS.config.server.port,
          host: BalmJS.config.server.host,
          https: BalmJS.config.server.https,
          open: BalmJS.config.server.open,
          localOnly: BalmJS.config.server.localOnly,
          scriptPath: BalmJS.config.scripts.ie8 ? (): string => '' : undefined
        };

        if (BalmJS.config.server.proxy) {
          if (BalmJS.utils.isString(BalmJS.config.server.proxy)) {
            bsOptions.proxy = {
              target: BalmJS.config.server.proxy
            };
          } else if (BalmJS.utils.isObject(BalmJS.config.server.proxy)) {
            bsOptions.proxy = BalmJS.config.server.proxy;
          } else {
            BalmJS.logger.error(
              `${this.name} task`,
              '`server.proxy` must be a string or object'
            );
          }

          bsOptions.serveStatic = BalmJS.config.server.serveStatic;
        } else {
          bsOptions.server = {
            baseDir: [BalmJS.config.dest.base, BalmJS.config.src.base],
            routes: {
              '/bower_components': BalmJS.file.absPath('bower_components'),
              '/node_modules': BalmJS.file.absPath('node_modules')
            }
          };
        }

        bsOptions.middleware = BalmJS.config.env.isDev
          ? getMiddlewares()
          : false;

        bsOptions = BalmJS.utils.deepMerge(
          bsOptions,
          BalmJS.config.server.options
        );

        if (BalmJS.config.env.isDev) {
          BalmJS.server = server.init(bsOptions);

          if (BalmJS.config.useDefaults) {
            this._onWatch();
          } else {
            BalmJS.watching = true;

            const watcher = watch([
              `${BalmJS.config.src.base}/**/*`,
              ...BalmJS.config.server.extraWatchFiles
            ]);

            try {
              customHandler && customHandler(watcher, server.reload);
            } catch (error) {
              BalmJS.logger.error('balm hook', error.message);
            }
          }
        }
      }

      cb();
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default ServerTask;
