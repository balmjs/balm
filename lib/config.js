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
    tmp: '.tmp', // temporary folder
    target: 'dist', // output folder
    cache: '.assets' // cache folder
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
      font: 'fonts' // TODO: the same to `this.paths.source.font`
        // cache: 'assets' // set `this.paths.target.cache` for generating `config.target.cache`
    }
  },
  styles: {
    autoprefixer: ['last 2 versions'],
    ext: 'scss' // extension: 'sass|scss|less'
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
  useDefault: true,
  zip: 'archive' // zip filename
};

export default defaults;
