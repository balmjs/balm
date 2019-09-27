import mergeStream from 'merge-stream';

class SpriteTask extends BalmJS.BalmImageTask {
  private tasks: string[] = [];

  constructor() {
    super('sprite');

    this.defaultInput = BalmJS.config.styles.sprites;

    if (this.defaultInput.length) {
      this.init();
      this.collect();
    }
  }

  private _getOption(name: string): any {
    const spriteName = `${name}-${this.name}s.png`;

    return {
      imgName: spriteName, // E.g. "icon-sprite.png"
      imgPath: `${BalmJS.config.styles.imageBasePath}${BalmJS.config.paths.target.img}/${spriteName}`, // E.g. "path/to/icon-sprite.png"
      padding: BalmJS.config.styles.spritePadding,
      cssName: `_${name}.${BalmJS.config.styles.extname}`, // E.g. "_icon.scss"
      cssFormat: BalmJS.config.styles.extname, // E.g. "scss"
      cssVarMap: function(sprite: any): void {
        sprite.name = `${name}-${sprite.name}`; // E.g. "icon-name"
      },
      cssSpritesheetName: `${name}-spritesheet`, // E.g. "icon-spritesheet"
      cssOpts: {
        cssSelector: (sprite: any): string => `.${sprite.name}` // Classname in css file: '.icon-name'
      }
    };
  }

  collect(): void {
    const spriteList = [];
    for (const spriteName of this.input) {
      spriteList.push({
        src: `${BalmJS.config.src.img}/${spriteName}/*.png`,
        name: spriteName
      });
    }

    for (let key = 0, len = spriteList.length; key < len; key++) {
      const value: any = spriteList[key];
      const spriteTaskName = `${this.name}:${value.name}`; // E.g. "sprite:name"
      const spriteConfig: any = {
        src: value.src,
        opt: this._getOption(value.name),
        img: this.output,
        css: `${BalmJS.config.src.css}/${this.name}s` // Don't modify
      };

      gulp.task(BalmJS.toNamespace(spriteTaskName) as string, function() {
        const spriteData = gulp
          .src(spriteConfig.src)
          .pipe($.spritesmith(spriteConfig.opt));
        const imgStream = spriteData.img.pipe(
          gulp.dest(BalmJS.file.absPath(spriteConfig.img))
        );
        const cssStream = spriteData.css.pipe(
          gulp.dest(BalmJS.file.absPath(spriteConfig.css))
        );

        return mergeStream(imgStream, cssStream);
      });

      this.tasks.push(spriteTaskName);
    }
  }

  get deps(): string[] {
    return this.tasks;
  }
}

export default SpriteTask;
