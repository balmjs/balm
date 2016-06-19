const defaults = {
  debug: false,
  static: false, // project type, e.g. PHP
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  server: {
    host: null, // e.g. localhost
    port: 9000,
    proxy: undefined, // e.g. project.local
    notify: false
  },
  roots: {
    source: 'app', // input folder
    tmp: '.tmp',
    target: 'dist', // output folder
    build: 'assets' // cache dir
  },
  paths: {
    source: {
      base: '', // project dir
      html: '', // template dir
      css: 'styles', // css dir
      js: 'scripts', // javascript dir
      img: 'images', // image dir
      font: 'fonts' // font dir
    },
    target: {
      base: '',
      html: '',
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'fonts' // TODO: the same to this.paths.source.font
    }
  },
  styles: {
    autoprefixer: ['last 2 versions'],
    ext: 'scss' // extension: 'css|sass|scss|less|stylus'
  },
  scripts: {
    // entry: {
    //   main: './app/scripts/main.js'
    // },
    loaders: [],
    extensions: []
  },
  sprites: {
    basePath: '..', // relative to css file
    cssPath: 'sprites', // css folder
    imgList: ['icon'] // image folder
  },
  cache: false,
  manifest: 'rev-manifest.json',
  useDefault: true
};

export default defaults;
