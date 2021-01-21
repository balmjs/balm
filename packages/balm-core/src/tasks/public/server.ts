import detectPort from '../../utilities/detect-port';
import getMiddlewares from '../../middlewares';

class ServerTask extends BalmJS.BalmTask {
  constructor() {
    super('serve');

    if (BalmJS.config.env.isDev) {
      detectPort(BalmJS.config.server.port, BalmJS.config.server.host).then(
        (port: number) => {
          if (BalmJS.config.server.port !== port) {
            BalmJS.logger.warn(
              'server task',
              `port: ${BalmJS.config.server.port} was occupied, try port: ${port}`
            );
            BalmJS.config.server.port = port;
          }
        },
        () => {}
      );
    }
  }

  #watchTask = (taskName: string, serverReload = false): Function => {
    const balmTask: Function = BalmJS.tasks.get(taskName).fn;
    const reload = (done: Function): void => {
      server.reload();
      done();
    };

    return serverReload ? gulp.series(balmTask, reload) : balmTask;
  };

  #onWatch = (): void => {
    const { watch } = gulp;

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
      `${BalmJS.config.src.html}/*.html`,
      watchOptions,
      this.#watchTask('html', true)
    );

    watch(
      `${BalmJS.config.src.css}/**/*.${BalmJS.config.styles.extname}`,
      watchOptions,
      this.#watchTask(BalmJS.config.inFrontend ? this.styleName : 'style')
    );

    if (!BalmJS.config.server.useHMR) {
      watch(
        `${BalmJS.config.src.js}/**/*`,
        watchOptions,
        this.#watchTask(BalmJS.config.scripts.bundler, true)
      );
    }

    watch(
      `${BalmJS.config.src.base}/modernizr.json`,
      watchOptions,
      this.#watchTask('modernizr')
    );

    watch(
      `${BalmJS.config.src.font}/**/*`,
      watchOptions,
      this.#watchTask('font')
    );

    // For FTP
    if (BalmJS.config.ftp.watchFiles.length) {
      watch(BalmJS.config.ftp.watchFiles, watchOptions).on(
        'change',
        (path: string) => {
          BalmJS.logger.debug(`${this.name} task`, `File ${path} was changed`);
          BalmJS.watchFtpFile = path;
          this.#watchTask('ftp', true)();
        }
      );
    }
  };

  recipe(customHandler?: Function): Function {
    const balmServe = (callback: Function): void => {
      if (BalmJS.server) {
        BalmJS.logger.warn('server task', 'Server has started');
      } else {
        const serverConfig = BalmJS.config.server;

        let bsOptions: any = {
          logPrefix: 'BalmJS',
          notify: false,
          port: serverConfig.port,
          host: serverConfig.host,
          https: serverConfig.https,
          callbacks: {
            ready() {
              if (BalmJS.config.env.isMP) {
                BalmJS.logger.info(
                  '提示',
                  `请使用微信开发者工具打开 ${BalmJS.config.roots.tmp} 预览小程序`,
                  { logLevel: BalmJS.LogLevel.Error }
                );
              }

              serverConfig.next();
            }
          },
          open: serverConfig.open,
          localOnly: BalmJS.config.env.inDesktopApp,
          scriptPath: BalmJS.config.scripts.ie8 ? (): string => '' : undefined
        };

        if (serverConfig.proxy) {
          if (BalmJS.utils.isString(serverConfig.proxy)) {
            bsOptions.proxy = {
              target: serverConfig.proxy
            };
          } else if (BalmJS.utils.isObject(serverConfig.proxy)) {
            bsOptions.proxy = serverConfig.proxy;
          } else {
            BalmJS.logger.error(
              `${this.name} task`,
              '`server.proxy` must be a string or object'
            );
          }

          bsOptions.serveStatic = serverConfig.serveStatic;
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

        bsOptions = BalmJS.utils.deepMerge(bsOptions, serverConfig.options);

        if (BalmJS.config.env.isDev) {
          BalmJS.server = server.init(bsOptions);

          if (BalmJS.config.useDefaults) {
            this.#onWatch();
          } else {
            BalmJS.watching = true;

            const watcher = gulp.watch([
              `${BalmJS.config.src.base}/**/*`,
              ...serverConfig.extraWatchFiles
            ]);

            try {
              customHandler && customHandler(watcher, server.reload);
            } catch (error) {
              BalmJS.logger.error('balm hook', error.message);
            }
          }
        }
      }

      callback();
    };

    return balmServe;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default ServerTask;
