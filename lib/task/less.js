import combiner from 'stream-combiner2';

class Less extends Task {
  constructor() {
    super('less');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      let combined = combiner.obj([
        gulp.src(this.getAbsPaths(input)),
        $.sourcemaps.init(),
        $.less({
          paths: path.join(config.workspace, '.')
        }),
        $.autoprefixer({
          browsers: config.styles.autoprefixer
        }),
        $.sourcemaps.write('.'),
        gulp.dest(output),
        reload({
          stream: true
        })
      ]);

      // any errors in the above streams will get caught
      // by this listener, instead of being thrown:
      combined.on('error', $.util.log);

      return combined;
    };
  }
}

export default Less;
