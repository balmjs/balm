import { isArray } from '../helpers';

class Version extends Task {
  constructor(input = '', output = '', excludes = []) {
    super('version');

    let customIncludes = isArray(input)
      ? File.absPaths(input).map(filename => {
          return filename;
        })
      : [File.absPaths(input)];
    let customExcludes = File.absPaths(excludes).map(filename => {
      return `!${filename}`;
    });

    this.input = [...customIncludes, ...customExcludes];
    this.output = File.absPaths(output);
  }

  get fn() {
    return () => {
      return gulp
        .src(this.input)
        .pipe($.revAll.revision(config.assets.options))
        .pipe(gulp.dest(this.output))
        .pipe($.revAll.manifestFile())
        .pipe(gulp.dest(this.output));
    };
  }
}

export default Version;
