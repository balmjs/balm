const defaults = {
  debug: false,
  static: false, // project type,  set `true` for the static HTML project
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  proxy: undefined, // your.project.local
  server: {
    host: null,
    port: 3000
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
    ext: 'scss' // extension: 'css|sass|scss|less'
  },
  scripts: {
    // entry: {
    //   main: './app/scripts/main.js'
    // },
    vendors: [],
    // output
    publicPath: '/',
    filename: '[name].js', // or '[name].[hash:5].js'
    // module
    loaders: [],
    // resolve
    extensions: [],
    alias: {},
    // profile
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    },
    // plugin
    plugins: [],
    extends: {} // for webpack config
  },
  sprites: {
    basePath: '..', // relative to css file
    cssPath: 'sprites', // css folder
    imgList: [] // image folder
  },
  cache: false,
  manifest: 'rev-manifest.json',
  zip: 'archive', // zip filename
  useDefault: true // use balm default task
};

export default defaults;
