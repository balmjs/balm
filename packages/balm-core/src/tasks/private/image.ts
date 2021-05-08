import { getDefaultImagePlugins } from '../../plugins/imagemin.js';
import { BalmImagesPlugins, BalmError } from '@balm-core/index';

class ImageTask extends BalmJS.BalmTask {
  constructor() {
    super('image');

    const excludeGlobs: string[] = [];
    for (const imageFolder of BalmJS.config.styles.sprites) {
      excludeGlobs.push(
        node.path.join(`!${BalmJS.config.src.img}`, imageFolder)
      );
      excludeGlobs.push(
        node.path.join(`!${BalmJS.config.src.img}`, imageFolder, '*.png')
      );
    }

    this.defaultInput = [
      BalmJS.file.matchAllFiles(BalmJS.config.src.img),
      ...excludeGlobs
    ];
    this.defaultOutput = BalmJS.config.dest.img;

    if (BalmJS.utils.isArray(BalmJS.config.images.plugins)) {
      this.plugins = BalmJS.config.images.plugins; // Using custom imagemin plugins
    } else {
      const defaultPlugins: {
        [key: string]: boolean | Function;
      } = Object.assign(
        getDefaultImagePlugins(),
        BalmJS.config.images.plugins as Partial<BalmImagesPlugins>
      );

      const enablePlugins = Object.keys(defaultPlugins).filter(
        (key) => defaultPlugins[key]
      );

      this.plugins = enablePlugins.map((key) => defaultPlugins[key]);

      BalmJS.logger.debug(`${this.name} task - plugins`, enablePlugins);
    }
  }

  fn = (): any => {
    this.init();

    const balmImage = () => {
      return gulp
        .src(BalmJS.file.absPaths(this.input), {
          since: gulp.lastRun(balmImage)
        })
        .pipe(
          BalmJS.plugins.plumber((error: BalmError): void => {
            BalmJS.logger.error(`${this.name} task`, error);
          })
        )
        .pipe(BalmJS.plugins.imagemin(this.plugins))
        .pipe(gulp.dest(this.output));
    };

    return balmImage();
  };
}

export default ImageTask;
