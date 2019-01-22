import BalmStyleTask from '../style';
import getPostcssPlugins from '../../plugins/postcss';

class SassTask extends BalmStyleTask {
  constructor(input = '', output = '') {
    super('sass');

    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).scss'
      );
    this.output = output || this.stylePath;
  }

  get options() {
    return {
      outputStyle: 'expanded',
      precision: 10,
      includePaths: BalmFile.stylePaths()
    };
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(!config.isProd, $.sourcemaps.init()))
        .pipe($.sass.sync(this.options))
        .pipe($.postcss(getPostcssPlugins(), config.styles.postcssOptions));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default SassTask;
