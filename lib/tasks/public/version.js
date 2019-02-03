import { isArray } from '../../utilities';

class VersionTask extends BalmTask {
  constructor(input = '', output = '', excludes = []) {
    super('version');

    let customIncludes = isArray(input)
      ? BalmFile.absPaths(input).map(filename => {
          return filename;
        })
      : [BalmFile.absPaths(input)];
    let customExcludes = BalmFile.absPaths(excludes).map(filename => {
      return `!${filename}`;
    });

    this.input = [...customIncludes, ...customExcludes];
    this.output = BalmFile.absPaths(output);
  }

  get fn() {
    return () => {
      return src(this.input)
        .pipe($.plumber())
        .pipe($.revAll.revision(config.assets.options))
        .pipe(dest(this.output))
        .pipe($.revAll.manifestFile())
        .pipe(dest(this.output));
    };
  }
}

export default VersionTask;
