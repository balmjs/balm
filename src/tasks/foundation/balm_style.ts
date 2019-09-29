import BalmTask from './balm';
import cssnano from 'cssnano';

class BalmStyleTask extends BalmTask {
  constructor(name: string) {
    super(name);

    let extname: string;
    switch (name) {
      case 'sass':
        extname = '{scss,sass}';
        break;
      case 'less':
        extname = 'less';
        break;
      default:
        extname = 'css';
    }

    this.defaultInput = path.join(
      BalmJS.config.roots.source,
      BalmJS.config.paths.source.css,
      '**',
      `!(_*).${extname}`
    );
    this.defaultOutput = BalmJS.config.dest.css;
  }

  handleStyle(style: string, output: string, options?: any): any {
    let stream: any = this.src
      .pipe(
        BalmJS.plugins.plumber(function(this: any, error: any): void {
          // https://github.com/floatdrop/gulp-plumber/issues/30
          BalmJS.logger.error('style task', error.message);
          // Must emit end event for any dependent streams to pick up on this. Destroying the stream
          // ensures nothing else in that stream gets done, for example, if we're dealing with five
          // files, after an error in one of them, any other won't carry on. Doing destroy without
          // ending it first will not notify depending streams, tasks like `watch` will hang up.
          this.emit('end');
          this.destroy();
        })
      )
      .pipe($.if(BalmJS.config.env.isDev, $.sourcemaps.init()));

    switch (style) {
      case 'sass':
        stream = stream.pipe($.sass.sync(options));
        break;
      case 'less':
        stream = stream.pipe($.less(options));
        break;
      default:
    }

    return stream
      .pipe($.postcss(BalmJS.plugins.postcss()))
      .pipe($.if(BalmJS.config.env.isDev, $.sourcemaps.write('.')))
      .pipe(
        $.if(
          BalmJS.config.env.isProd,
          $.postcss([cssnano(BalmJS.config.styles.options)])
        )
      )
      .pipe(gulp.dest(BalmJS.file.absPath(output)))
      .pipe(server.reload({ stream: true }));
  }
}

export default BalmStyleTask;
