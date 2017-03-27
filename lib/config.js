const DEFAULTS = {
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
    open: true,
    browser: true,
    host: null,
    port: 3000,
    proxy: undefined, // Host: your.project.local
    proxyTable: {
      // '/api': {
      //   target: 'http://your.project.dev', // target host
      //   changeOrigin: true // needed for virtual hosted sites
      // }
    },
    localOnly: false // Support environments where dynamic hostnames are not required (ie: electron)
  },
  workspace: process.cwd(),
  roots: {
    source: 'src', // Input folder (Source Code)
    tmp: '.tmp', // Temporary folder (Development)
    target: 'dist' // Output folder (Production)
  },
  paths: {
    source: {
      base: '', // Project directory
      html: '', // Template directory
      css: 'styles', // Stylesheet directory
      js: 'scripts', // Javascript directory
      img: 'images', // Image directory
      font: 'fonts' // Font directory
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
      css: 'css',
      js: 'js',
      img: 'images'
    },
    replacement: {
      prefix: '"',
      begin: '/',
      end: '/'
    },
    options: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  },
  styles: {
    ext: 'css', // Main style extension: 'css|less|sass|scss'
    autoprefixer: ['last 1 version'],
    postcss: [], // Postcss plugins
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
    vendor: false, // Extract all vendors for SPA (all in one)
    vendors: [], // Custom extract vendors for WEB
    // Output
    publicPath: '', // For hot reload & building chunk dir
    filename: '[name]',
    chunkFilename: '[id]',
    // Module
    loaders: [],
    // Resolve
    extensions: [],
    alias: {},
    // Profile
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    },
    // Plugin
    plugins: [],
    extends: {}, // For extra webpack config
    // Hot reload
    HMR: true,
    // Source map
    sourceMap: false,
    // Lint
    eslint: false
  },
  sprites: {
    basePath: '../', // Relative to css file
    padding: 0,
    image: [], // Image folder
    mode: 'css', // Svg mode: 'css|view|defs|symbol|stack'
    svg: [] // Svg folder
  },
  zip: 'archive.zip', // Zip filename
  ftp: {
    host: '', // Required
    port: 22,
    user: 'anonymous',
    pass: null,
    remotePath: '/'
  },
  cache: false,
  assets: {
    manifest: 'manifest.json',
    root: 'assets', // Remote project root simulation
    publicPath: 'public', // The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)
    subDir: '' // Public subdirectory
  },
  useDefault: true // Use balm default task
};

export default DEFAULTS;
