import merge from 'merge-stream';

class Sprite {
  constructor() {
    let spriteList = [];
    for (let spriteName of config.sprites.imgList) {
      spriteList.push({
        src: config.app.img + '/' + spriteName + '/*.png',
        name: spriteName
      });
    }

    let spriteTasks = [];
    for (let key = 0, len = spriteList.length; key < len; key++) {
      let value = spriteList[key];
      let spriteTaskName = value.name + '-sprite';
      let spriteConfig = {
        src: value.src,
        opt: this.getOption(value.name),
        img: config.app.img,
        css: config.app.css + config.sprites.cssPath
      };

      gulp.task(spriteTaskName, function() {
        let spriteData = gulp.src(spriteConfig.src)
          .pipe($.spritesmith(spriteConfig.opt));

        let imgStream = spriteData.img
          .pipe(gulp.dest(spriteConfig.img));

        let cssStream = spriteData.css
          .pipe(gulp.dest(spriteConfig.css));

        return merge(imgStream, cssStream);
      });

      spriteTasks.push(spriteTaskName);
    }

    gulp.task('sprites', spriteTasks);
  }
  getOption(name) {
    let spriteImgPath = config.production ? config.paths.dist.img : config.paths.app.img;
    let spriteName = name + '-sprite.png';

    return {
      imgName: spriteName, // e.g. icon-sprite.png
      imgPath: config.sprites.basePath + spriteImgPath + '/' + spriteName, // e.g. path/to/icon-sprite.png
      cssName: '_' + name + '.' + config.styles.ext, // e.g. _icon.scss
      cssFormat: config.styles.ext, // e.g. scss
      cssVarMap: sprite => {
        sprite.name = name + '-' + sprite.name; // e.g. icon-name
      },
      cssSpritesheetName: name + '-spritesheet' // e.g. icon-spritesheet
    };
  }
}

export default Sprite;
