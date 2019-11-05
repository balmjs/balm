import mergeStream from 'merge-stream';

interface SpriteItem {
  src: string;
  retinaSrc: string;
  folderName: string;
}

interface SpriteConfig {
  input: string;
  params: object;
  imgOutput: string;
  cssOutput: string;
}

class SpriteTask extends BalmJS.BalmTask {
  private tasks: string[] = [];

  constructor() {
    super('sprite');

    this.defaultInput = BalmJS.config.styles.sprites;
    this.defaultOutput = BalmJS.config.dest.img;

    this.recipe(this.defaultInput);
  }

  private _getParams(spriteItem: SpriteItem): object {
    const spriteName = `${spriteItem.folderName}-${this.name}s`;

    let defaultParams: object = Object.assign(
      {
        padding: 1
      },
      {
        imgName: `${spriteName}.png`, // E.g. 'awesome-sprites.png'
        cssName: `_${spriteItem.folderName}.${BalmJS.config.styles.extname}`, // E.g. "_awesome.scss"
        imgPath: `${BalmJS.config.styles.imageBasePath}${BalmJS.config.paths.target.img}/${spriteName}.png`, // E.g. "path/to/img/awesome-sprites.png"
        cssSpritesheetName: `${spriteItem.folderName}-spritesheet`, // E.g. "awesome-spritesheet"
        cssOpts: {
          cssSelector: (sprite: any): string =>
            `.${spriteItem.folderName}-${sprite.name}` // Classname in css file: '.icon-awesome'
        }
      }
    );

    if (BalmJS.config.styles.spriteRetina) {
      defaultParams = Object.assign(defaultParams, {
        retinaSrcFilter: `${spriteItem.retinaSrc}`,
        retinaImgName: `${spriteName}@2x.png`, // E.g. 'awesome-sprites@2x.png'
        retinaImgPath: `${BalmJS.config.styles.imageBasePath}${BalmJS.config.paths.target.img}/${spriteName}@2x.png`, // E.g. "path/to/img/awesome-sprites@2x.png"
        cssRetinaSpritesheetName: `${spriteItem.folderName}-spritesheet-2x`, // E.g. "awesome-spritesheet-2x"
        cssRetinaGroupsName: `${spriteItem.folderName}-retina-groups` // E.g. "awesome-retina-groups"
      });
    }

    return Object.assign(defaultParams, BalmJS.config.styles.spriteParams);
  }

  collect(): void {
    const spriteList: SpriteItem[] = [];
    for (const spriteName of this.input) {
      spriteList.push({
        src: `${BalmJS.config.src.img}/${spriteName}/*.png`,
        retinaSrc: `${BalmJS.config.src.img}/${spriteName}/*@2x.png`,
        folderName: spriteName
      });
    }

    for (let key = 0, len = spriteList.length; key < len; key++) {
      const spriteItem: SpriteItem = spriteList[key];
      const spriteTaskName = `${this.name}:${spriteItem.folderName}`; // E.g. 'sprite:awesome'
      const spriteConfig: SpriteConfig = {
        input: spriteItem.src,
        params: this._getParams(spriteItem),
        imgOutput: this.output,
        cssOutput: `${BalmJS.config.src.css}/${this.name}s` // E.g. 'path/to/css/sprites'
      };

      gulp.task(BalmJS.toNamespace(spriteTaskName) as string, () => {
        const spriteData = gulp
          .src(spriteConfig.input)
          .pipe(
            BalmJS.plugins.plumber((error: any): void => {
              BalmJS.logger.error(`${this.name} task`, error.message);
            })
          )
          .pipe($.spritesmith(spriteConfig.params));

        const imgStream = spriteData.img.pipe(
          gulp.dest(BalmJS.file.absPath(spriteConfig.imgOutput))
        );
        const cssStream = spriteData.css.pipe(
          gulp.dest(BalmJS.file.absPath(spriteConfig.cssOutput))
        );

        return mergeStream(imgStream, cssStream);
      });

      this.tasks.push(spriteTaskName);
    }
  }

  recipe(sprites: string[]): void {
    if (sprites.length) {
      this.tasks = []; // Reset

      this.init(sprites);
      this.collect();
    }
  }

  get deps(): string[] {
    return this.tasks;
  }
}

export default SpriteTask;
