/**
 * CSS Sprites
 */
class Sprite {
  constructor() {
    this.dist = !config.production ? config.tmp.img : config.target.img;

    this.tasks = [];

    if (config.sprites.imgList.length) {
      let spriteList = [];
      for (let spriteName of config.sprites.imgList) {
        spriteList.push({
          src: config.source.img + '/' + spriteName + '/*.png',
          name: spriteName
        });
      }

      for (let key = 0, len = spriteList.length; key < len; key++) {
        let value = spriteList[key];
        let spriteTaskName = this.name + ':' + value.name; // "sprites:name"
        let spriteConfig = {
          src: value.src,
          opt: this.getOption(value.name),
          img: this.dist,
          css: config.source.css + '/' + config.sprites.cssPath // don't modify
        };

        gulp.task(spriteTaskName, () => {
          let spriteData = gulp.src(spriteConfig.src)
            .pipe($.spritesmith(spriteConfig.opt));

          let imgStream = spriteData.img
            .pipe(gulp.dest(spriteConfig.img));

          let cssStream = spriteData.css
            .pipe(gulp.dest(spriteConfig.css));

          return require('merge-stream')(imgStream, cssStream);
        });

        this.tasks.push(spriteTaskName);
      }
    }
  }
  getOption(name) {
    let spriteName = name + '-sprite.png';

    return {
      imgName: spriteName, // e.g. "icon-sprite.png"
      imgPath: config.sprites.basePath + config.paths.target.img + '/' + spriteName, // e.g. "path/to/icon-sprite.png"
      cssName: '_' + name + '.' + config.styles.ext, // e.g. "_icon.scss"
      cssFormat: config.styles.ext, // e.g. "scss"
      cssVarMap: sprite => {
        sprite.name = name + '-' + sprite.name; // e.g. "icon-name"
      },
      cssSpritesheetName: name + '-spritesheet' // e.g. "icon-spritesheet"
    };
  }
  get name() {
    return 'sprites';
  }
  get deps() {
    return this.tasks;
  }
  get fn() {
    return noop;
  }
}

export default Sprite;
