import mergeStream from '../../utilities/merge-stream.js';
import { SpriteOptions, BalmError } from '@balm-core/index';

interface SpriteItem {
  src: string;
  retinaSrc: string;
  folderName: string;
}

interface SpriteConfig {
  input: string;
  params?: object;
  imgOutput: string;
  cssOutput: string;
}

class SpriteTask extends BalmJS.BalmTask {
  #tasks: string[] = [];

  constructor() {
    super('sprite');

    this.defaultInput = BalmJS.config.styles.sprites;
    this.defaultOutput = BalmJS.config.dest.img;

    if (this.defaultInput.length) {
      this.init();
      this.collect();
    }
  }

  #getParams = (
    spriteItem: SpriteItem,
    spriteOptions: SpriteOptions
  ): object => {
    const stylesConfig = Object.assign(spriteOptions, BalmJS.config.styles);
    const spriteName = `${spriteItem.folderName}-${this.name}s`;
    const imageTarget: string =
      stylesConfig.imageTarget || BalmJS.config.paths.target.img;

    let defaultParams: object = Object.assign(
      {
        padding: 1
      },
      {
        imgName: `${spriteName}.png`, // E.g. 'awesome-sprites.png'
        cssName: `_${spriteItem.folderName}.${stylesConfig.extname}`, // E.g. "_awesome.{css,sass,scss,less}"
        imgPath: `${stylesConfig.imageBasePath}${imageTarget}/${spriteName}.png`, // E.g. "../img/awesome-sprites.png"
        cssVarMap: (sprite: { name: string }) => {
          sprite.name = `${spriteItem.folderName}-${sprite.name}`; // E.g. "awesome-icon-name"
        },
        cssSpritesheetName: `${spriteItem.folderName}-spritesheet`, // E.g. "awesome-spritesheet"
        cssOpts: {
          cssSelector: (sprite: { name: string }): string => `.${sprite.name}` // className in css file: '.icon-awesome'
        }
      }
    );

    if (stylesConfig.spriteRetina) {
      defaultParams = Object.assign(defaultParams, {
        retinaSrcFilter: `${spriteItem.retinaSrc}`,
        retinaImgName: `${spriteName}@2x.png`, // E.g. 'awesome-sprites@2x.png'
        retinaImgPath: `${stylesConfig.imageBasePath}${imageTarget}/${spriteName}@2x.png`, // E.g. "../img/awesome-sprites@2x.png"
        cssVarMap: (sprite: any) => {
          sprite.name = `${spriteItem.folderName}-${sprite.name}`; // E.g. "awesome-icon-name"
        },
        cssRetinaSpritesheetName: `${spriteItem.folderName}-spritesheet-2x`, // E.g. "awesome-spritesheet-2x"
        cssRetinaGroupsName: `${spriteItem.folderName}-retina-groups` // E.g. "awesome-retina-groups"
      });
    }

    return Object.assign(defaultParams, stylesConfig.spriteParams);
  };

  collect(spriteOptions: SpriteOptions = {}): void {
    const spriteList: SpriteItem[] = [];
    for (const spriteName of this.input as string[]) {
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
        input: BalmJS.file.absPath(spriteItem.src),
        imgOutput: BalmJS.file.absPath(this.output),
        cssOutput: BalmJS.file.absPath(`${BalmJS.config.src.css}/${this.name}s`) // E.g. 'path/to/css/sprites'
      };

      BalmJS.logger.debug(`${this.name} task`, spriteConfig, {
        pre: true
      });

      spriteConfig.params = this.#getParams(spriteItem, spriteOptions);

      gulp.task(BalmJS.toNamespace(spriteTaskName) as string, () => {
        const spriteData = gulp
          .src(spriteConfig.input)
          .pipe(
            BalmJS.plugins.plumber((error: BalmError): void => {
              BalmJS.logger.error(`${this.name} task`, error.message);
            })
          )
          .pipe($.spritesmith(spriteConfig.params));

        const imgStream = spriteData.img.pipe(
          gulp.dest(spriteConfig.imgOutput)
        );
        const cssStream = spriteData.css.pipe(
          gulp.dest(spriteConfig.cssOutput)
        );

        return mergeStream(imgStream, cssStream);
      });

      this.#tasks.push(spriteTaskName);
    }
  }

  recipe(
    input: string[],
    output: string,
    spriteOptions: SpriteOptions = {}
  ): void {
    if (input.length) {
      if (output && !spriteOptions.imageTarget) {
        spriteOptions.imageTarget = output.split('/').pop();
      }

      this.init(input, output);
      this.collect(spriteOptions);
    }
  }

  get deps(): string[] {
    return this.#tasks;
  }
}

export default SpriteTask;
