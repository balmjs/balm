import BalmStyleTask from '../style';
import getPostcssPlugins from '../../plugins/postcss';

class Less extends BalmStyleTask {
  constructor(input = '', output = '') {
    super('less');

    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).less'
      );
    this.output = output || this.stylePath;
  }

  get options() {
    return {
      paths: BalmFile.stylePaths()
    };
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.less(this.options))
        .pipe($.postcss(getPostcssPlugins(), config.styles.postcssOptions));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default Less;
