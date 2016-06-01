import { mergeDeep } from './helper';

let defaults = {
  debug: false,
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  AUTOPREFIXER: ['last 2 versions'],
  server: {
    port: 9000
  },
  roots: {
    app: 'app',
    tmp: '.tmp',
    dist: 'dist'
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
  webpack: {
    entry: {}
  },
  sprite: {
    cssPath: '/sprites',
    imgList: ['icon'],
    app: {
      img: '../images'
    },
    dist: {
      img: '../img'
    }
  }
};

const config = mergeDeep(defaults, {
  paths: {
    tmp: defaults.paths.app
  }
});

export default config;
