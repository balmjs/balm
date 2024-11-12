import BalmTask from './balm.js';
import { ASSET } from '../../config/constants.js';
import { BalmError } from '@balm-core/index';

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

    if (Array.isArray(BalmJS.config.styles.entry)) {
      this.defaultInput = BalmJS.config.styles.entry.map((styleEntry) =>
        node.path.join(BalmJS.config.src.css, styleEntry)
      );
    } else {
      if (BalmJS.config.styles.entry) {
        this.defaultInput = node.path.join(
          BalmJS.config.src.css,
          BalmJS.config.styles.entry
        );
      } else {
        this.defaultInput = node.path.join(
          BalmJS.config.src.css,
          '**',
          `!(_*).${extname}`
        );
      }
    }

    this.defaultOutput = BalmJS.config.env.isMP
      ? node.path.join(
          BalmJS.config.dest.base,
          ASSET.mpDir,
          BalmJS.config.paths.target.css
        )
      : BalmJS.config.dest.css;
  }

  handleStyle(style: string, output: string, options?: object): any {
    BalmJS.logger.debug(`${this.name} entry`, this.defaultInput, {
      pre: true
    });

    const taskName = `${this.name} task`;
    const shouldUseSourceMap = !(
      BalmJS.config.env.isProd || BalmJS.config.styles.minify
    );

    let stream: any = gulp
      .src(
        this.input,
        Object.assign(
          {
            sourcemaps: shouldUseSourceMap,
            allowEmpty: true
          },
          this.gulpSrcOptions
        )
      )
      .pipe(
        BalmJS.plugins.plumber(function (this: any, error: BalmError): void {
          // https://github.com/floatdrop/gulp-plumber/issues/30
          BalmJS.logger.error(taskName, error.message);
          // Must emit end event for any dependent streams to pick up on this. Destroying the stream
          // ensures nothing else in that stream gets done, for example, if we're dealing with five
          // files, after an error in one of them, any other won't carry on. Doing destroy without
          // ending it first will not notify depending streams, tasks like `watch` will hang up.
          this.emit('end');
          this.destroy();
        })
      );

    switch (style) {
      case 'sass':
        stream = stream.pipe(BalmJS.plugins.sass(options));
        break;
      case 'less':
        stream = stream.pipe(BalmJS.plugins.less(options));
        break;
      default:
    }

    return stream
      .pipe(
        BalmJS.plugins.postcss(
          BalmJS.plugins.postcssPlugins(style === 'postcss')
        )
      )
      .pipe(
        $.if(
          BalmJS.config.env.isMP,
          BalmJS.plugins.rename({ extname: '.wxss' })
        )
      )
      .pipe(
        gulp.dest(output, {
          sourcemaps: shouldUseSourceMap
        })
      )
      .pipe(server.reload({ stream: true }));
  }
}

export default BalmStyleTask;
