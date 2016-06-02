import merge from 'merge-stream';

class Sprite {
  constructor() {
    let spriteList = [];
    for (let spriteName of config.sprite.imgList) {
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
        css: config.app.css + config.sprite.cssPath
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

    return {
      imgName: name + '-sprite.png',
      imgPath: config.sprite.basePath + spriteImgPath + '/' + name + '-sprite.png',
      cssName: '_' + name + '.scss',
      cssFormat: 'scss',
      cssVarMap: sprite => {
        sprite.name = name + '-' + sprite.name;
      },
      cssSpritesheetName: name + '-spritesheet'
    };
  }
}

export default Sprite;
