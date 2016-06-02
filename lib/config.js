const defaults = {
  debug: false,
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  server: {
    port: 9000
  },
  roots: {
    app: 'app', // input folder
    tmp: '.tmp',
    dist: 'dist' // output folder
  },
  paths: {
    app: {
      base: '/',
      css: '/styles',
      js: '/scripts',
      img: '/images',
      font: '/fonts'
    },
    dist: {
      base: '/',
      css: '/css',
      js: '/js',
      img: '/img',
      font: '/fonts' // TODO: the same to this.paths.app.font
    }
  },
  styles: {
    AUTOPREFIXER: ['last 2 versions'],
    ext: 'scss' // extension: ['css', 'sass', 'scss', 'less', 'stylus']
  },
  scripts: {
    // entry: {}
  },
  sprites: {
    basePath: '..', // relative to css file
    cssPath: '/sprites', // css folder
    imgList: ['icon'] // image folder
  }
};

export default defaults;
