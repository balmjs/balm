import BalmImageTask from '../image';

class SvgTask extends BalmImageTask {
  constructor() {
    super('svg');

    this.tasks = [];
    this.cssFilenames = []; // Fuck mode.css bug

    if (config.sprites.svg.length) {
      for (let svgName of config.sprites.svg) {
        let svgConfig = this.getOption(svgName);
        let svgTaskName = `svg:${svgName}`;

        task(toNamespace(svgTaskName), () => {
          return src(`${config.source.img}/${svgName}/*.svg`)
            .pipe($.svgSprite(svgConfig))
            .pipe(dest(this.imageDist))
            .pipe($.if('_*.css', dest(`${config.source.css}/svg`))); // Fix mode.css bug
        });

        this.tasks.push(svgTaskName);
      }
    }
  }

  getOption(name) {
    let render = {};
    let extensions = config.styles.ext;
    let filename = `_${name}.${extensions}`;
    let stylePath = path.join(
      '..',
      '..',
      config.roots.source,
      config.paths.source.css,
      'svg',
      filename
    );

    // Fix svg plugin path bug
    if (config.production && config.assets.subDir.trim()) {
      for (
        let i = 0, len = config.assets.subDir.split('/').length;
        i < len;
        i++
      ) {
        stylePath = path.join('..', stylePath);
      }
    }

    // Generate style
    render[extensions] = {
      dest: stylePath // Relative path to mode.dest
    };

    // Fix mode.css bug
    if (extensions === 'css') {
      render.css.dest = filename;
      this.cssFilenames.push(filename);
    }

    // Generate svg
    let mode = {};
    mode[config.sprites.mode] = {
      dest: '.', // Default 'css'
      sprite: `${config.sprites.basePath}${config.paths.target.img}/${name}-${
        config.sprites.mode
      }.svg`,
      bust: false, // Use `gulp-rev`
      render: render
    };

    let shape = {
      spacing: {
        padding: config.sprites.padding
      }
    };

    return {
      dest: config.workspace,
      mode: mode,
      shape: shape
    };
  }

  get deps() {
    return this.tasks;
  }

  get fn() {
    return cb => {
      if (config.production) {
        this.cssFilenames.map(cssFilename =>
          del(`${config.target.img}/${cssFilename}`, { force: true })
        );
      }

      cb();
    };
  }
}

export default SvgTask;
