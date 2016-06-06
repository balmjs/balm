const defaults = {
  debug: false,
  static: false, // project type, e.g. PHP
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  server: {
    proxy: undefined,
    port: 9000,
    notify: false
  },
  roots: {
    app: 'app', // input folder
    tmp: '.tmp',
    dist: 'dist' // output folder
  },
  paths: {
    app: {
      base: '/', // project dir
      html: '/', // template dir
      css: '/styles', // css dir
      js: '/scripts', // javascript dir
      img: '/images', // image dir
      font: '/fonts' // font dir
    },
    dist: {
      base: '/',
      html: '/',
      css: '/css',
      js: '/js',
      img: '/img',
      font: '/fonts' // TODO: the same to this.paths.app.font
    }
  },
  styles: {
    AUTOPREFIXER: ['last 2 versions'],
    ext: 'scss' // extension: 'css|sass|scss|less|stylus'
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
