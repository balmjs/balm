import BalmStyleTask from '../style';
import getPostcssPlugins from '../../plugins/postcss';

class Css extends BalmStyleTask {
  constructor(input = '', output = '') {
    super('css');

    this.input =
      input ||
      path.join(
        config.roots.source,
        config.paths.source.css,
        '**',
        '!(_*).css'
      );
    this.output = output || this.stylePath;
  }

  get fn() {
    return () => {
      let stream = src(BalmFile.absPaths(this.input))
        .pipe($.plumber(this.errorHandler))
        .pipe($.if(!config.production, $.sourcemaps.init()))
        .pipe($.postcss(getPostcssPlugins(), config.styles.postcssOptions));

      return this.handleStyle(stream, this.output);
    };
  }
}

export default Css;
