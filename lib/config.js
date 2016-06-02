import { mergeDeep } from './helper';

let defaults = {
  debug: false,
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  AUTOPREFIXER: ['last 2 versions'],
  server: {
    port: 9000
  },
  roots: {
    app: 'app',  // input folder
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
  scripts: {
    // entry: {}
  },
  sprite: {
    basePath: '..',      // relative to css file
    cssPath: '/sprites', // css folder
    imgList: ['icon']    // image folder
  }
};

const config = mergeDeep(defaults, {
  paths: {
    tmp: defaults.paths.app
  }
});

export default config;
