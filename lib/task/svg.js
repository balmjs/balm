/**
 * 3. Background & Inline SVG
 */
class Svg {
  constructor() {
    this.dist = !config.production ? config.tmp.img : config.target.img;

    this.tasks = [];

    if (config.sprites.svg.length) {
      for (let svgName of config.sprites.svg) {
        let svgConfig = this.getOption(svgName);
        let svgTaskName = this.name + ':' + svgName;

        gulp.task(svgTaskName, () => {
          return gulp.src(config.source.img + '/' + svgName + '/*.svg')
            .pipe($.svgSprite(svgConfig))
            .pipe(gulp.dest(this.dist));
        });

        this.tasks.push(svgTaskName);
      }
    }
  }
  getOption(name) {
    let extensions = (config.styles.ext === 'sass') ? 'scss' : config.styles.ext;

    let render = {};
    render[extensions] = {
      dest: '../../' + config.source.css + '/svg/_' + name + '.' + extensions // relative path
    };

    let mode = {};
    mode[config.sprites.mode] = {
      dest: '.',
      sprite: config.sprites.basePath + config.paths.target.img + '/' + name + '.' + config.sprites.mode + '.svg',
      bust: config.production,
      render: render
    };

    return {
      mode: mode
    };
  }
  get name() {
    return 'svg';
  }
  get deps() {
    return this.tasks;
  }
  get fn() {
    return noop;
  }
}

export default Svg;
