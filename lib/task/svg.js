/**
 * 3. Background & Inline SVG
 */
class Svg extends Task {
  constructor() {
    super('svg');

    this.tasks = [];
    this.cssFilenames = []; // fuck mode.css bug

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
    let render = {};
    let extensions = (config.styles.ext === 'sass') ? 'scss' : config.styles.ext;
    let stylePath = '../../' + config.roots.source + '/' + config.paths.source.css + '/svg/_' + name + '.' + extensions;

    // fix svg plugin path bug
    if (config.production && config.assets.subDir.trim()) {
      for (let i = 0, len = config.assets.subDir.split('/').length; i < len; i++) {
        stylePath = path.join('..', stylePath);
      }
    }

    // generate style
    render[extensions] = {
      dest: stylePath // relative path to mode.dest
    };

    // fix mode.css bug
    if (extensions === 'css') {
      let cssFilename = '_' + name + '.' + extensions;
      render.css.dest = cssFilename;
      this.cssFilenames.push(cssFilename);
    }

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
  get fn() {
    return () => {
      if (config.production) {
        this.cssFilenames.map(cssFilename => {
          return del(config.target.img + '/' + cssFilename);
        });
      }
    };
  }
}

export default Svg;
