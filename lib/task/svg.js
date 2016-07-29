/**
 * 3. Background & Inline SVG
 */
class Svg extends Task {
  constructor() {
    super('svg');

    this.tasks = [];

    if (config.sprites.svg.length) {
      for (let svgName of config.sprites.svg) {
        let svgConfig = this.getOption(svgName);
        let svgTaskName = this.name + ':' + svgName;

        gulp.task(svgTaskName, () => {
          return gulp.src(config.source.img + '/' + svgName + '/*.svg')
            .pipe($.svgSprite(svgConfig))
            .pipe(gulp.dest(this.dist))
            .pipe($.if('_*.css', gulp.dest(config.source.css + '/svg'))); // fix mode.css bug
        });

        this.tasks.push(svgTaskName);
      }
    }
  }
  getOption(name) {
    let extensions = (config.styles.ext === 'sass') ? 'scss' : config.styles.ext;

    // generate style
    let render = {};
    render[extensions] = {
      dest: (extensions === 'css') ? '_' + name + '.' + extensions : '../../' + config.roots.source + '/' + config.paths.source.css + '/svg/_' + name + '.' + extensions // relative path to mode.dest (mode.css has bug!)
    };

    // generate svg
    let mode = {};
    mode[config.sprites.mode] = {
      dest: '.', // default 'css'
      sprite: config.sprites.basePath + config.paths.target.img + '/' + name + '-' + config.sprites.mode + '.svg',
      bust: false, // use `gulp-rev`
      render: render
    };

    return {
      dest: config.workspace,
      mode: mode
    };
  }
  get deps() {
    return this.tasks;
  }
}

export default Svg;
