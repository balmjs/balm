import { BalmImagesPlugins, BalmError } from '@balm-types/index';

const IMAGEMIN_PLUGINS: { [key: string]: Function } = {
  gif: $.imagemin.gifsicle,
  jpeg: $.imagemin.mozjpeg,
  png: $.imagemin.optipng,
  svg: $.imagemin.svgo
};

class ImageTask extends BalmJS.BalmTask {
  constructor() {
    super('image');

    const excludeGlobs: string[] = [];
    for (const imageFolder of BalmJS.config.styles.sprites) {
      excludeGlobs.push(path.join(`!${BalmJS.config.src.img}`, imageFolder));
      excludeGlobs.push(
        path.join(`!${BalmJS.config.src.img}`, imageFolder, '*.png')
      );
    }

    this.defaultInput = [
      BalmJS.file.matchAllFiles(BalmJS.config.src.img),
      ...excludeGlobs
    ];
    this.defaultOutput = BalmJS.config.dest.img;

    if (BalmJS.utils.isArray(BalmJS.config.images.plugins)) {
      this.plugins = BalmJS.config.images.plugins;
    } else {
      const enablePlugins: { [key: string]: boolean } = Object.assign(
        {
          gif: true,
          jpeg: true,
          png: true,
          svg: true
        },
        BalmJS.config.images.plugins as Partial<BalmImagesPlugins>
      );

      this.plugins = Object.keys(enablePlugins)
        .filter((key) => enablePlugins[key])
        .map((key) => IMAGEMIN_PLUGINS[key]());
    }
  }

  fn = (): any => {
    this.init();

    const images = () => {
      return gulp
        .src(BalmJS.file.absPaths(this.input), {
          since: gulp.lastRun(images)
        })
        .pipe(
          BalmJS.plugins.plumber((error: BalmError): void => {
            BalmJS.logger.error(`${this.name} task`, error.message);
          })
        )
        .pipe($.if(this.plugins.length, $.imagemin(this.plugins)))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };

    return images();
  };
}

export default ImageTask;
