const defaults = {
  debug: false,
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  /**
   * Project Type
   * @type {Boolean}
   *
   * set `false` for a dynamic language project
   * set `true` for a static HTML project
   */
  static: false,
  server: {
    host: null,
    port: 3000,
    proxy: undefined, // your.project.local
    proxyTable: {
      // '/api': {
      //   target: 'http://your.project.local', // target host
      //   changeOrigin: true // needed for virtual hosted sites
      // }
    },
    localOnly: false // Support environments where dynamic hostnames are not required (ie: electron)
  },
  workspace: process.cwd(),
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
    autoprefixer: ['last 1 version'],
    ext: 'css' // extension: 'css|sass|scss|less'
  },
  scripts: {
    // entry: {
    //   main: './app/scripts/main.js'
    // },
    vendors: [],
    // output
    publicPath: '/js/', // for hot reload & building chunk dir
    filename: '[name].js', // or '[name].[hash:5].js' etc.
    chunkFilename: '[id].js', // or '[chunkhash].js' etc.
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
    extends: {}, // for extra webpack config
    HMR: true // use hot reload
  },
  sprites: {
    basePath: '../', // relative to css file
    image: [], // image folder
    mode: 'css', // svg mode: 'css|view|defs|symbol|stack'
    svg: [] // svg folder
  },
  cache: {
    enabled: false,
    manifest: 'manifest.json',
    revDel: true
  },
  zip: 'archive.zip', // zip filename
  ftp: {
    host: '', // required
    port: 22,
    user: 'anonymous',
    pass: null,
    remotePath: '/'
  },
  useDefault: true // use balm default task
};

export default defaults;
