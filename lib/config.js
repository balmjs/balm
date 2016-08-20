const defaults = {
  debug: false,
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  /**
   * Project Type
   * @type {Boolean}
   *
   * set `true` for a static HTML project
   * set `false` for a dynamic language project (e.g. PHP framework)
   */
  static: true,
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
    source: 'src', // input folder (Source Code)
    tmp: '.tmp', // temporary folder (Development)
    target: 'dist' // output folder (Production)
  },
  paths: {
    source: {
      base: '', // project directory
      html: '', // template directory
      css: 'styles', // stylesheet directory
      js: 'scripts', // javascript directory
      img: 'images', // image directory
      font: 'fonts' // font directory
    },
    target: {
      base: '',
      html: '',
      css: 'css',
      js: 'js',
      img: 'img',
      font: 'font'
    }
  },
  html: {
    regex: {
      css: 'css/',
      js: 'js/',
      img: 'images/'
    },
    replacement: {
      begin: '',
      end: '/'
    }
  },
  styles: {
    ext: 'css', // extension: 'css|sass|scss|less'
    autoprefixer: ['last 1 version'],
    options: {
      safe: true,
      autoprefixer: false,
      discardComments: {
        removeAll: true
      }
    }
  },
  scripts: {
    entry: {},
    vendors: [],
    // output
    publicPath: '/', // for hot reload & building chunk dir
    filename: '[name]',
    chunkFilename: '[id]',
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
    // hot reload
    HMR: true
  },
  sprites: {
    basePath: '../', // relative to css file
    image: [], // image folder
    mode: 'css', // svg mode: 'css|view|defs|symbol|stack'
    svg: [] // svg folder
  },
  zip: 'archive.zip', // zip filename
  ftp: {
    host: '', // required
    port: 22,
    user: 'anonymous',
    pass: null,
    remotePath: '/'
  },
  cache: false,
  assets: {
    manifest: 'manifest.json',
    root: 'assets', // remote project root simulation
    publicPath: 'public', // The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)
    subDir: '' // public subdirectory
  },
  useDefault: true // use balm default task
};

export default defaults;
