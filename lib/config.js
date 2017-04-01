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
      css: 'styles', // Stylesheet directory: `src/styles`
      js: 'scripts', // Javascript directory: `src/scripts`
      img: 'images', // Image directory: `src/images`
      font: 'fonts' // Font directory: `src/fonts`
    },
    target: {
      base: '',
      html: '',
      css: 'css', // `dist/css`
      js: 'js', // `dist/js`
      img: 'img', // `dist/img`
      font: 'font' // `dist/font`
    }
  },
  html: {
    regex: {
      css: 'styles', // The same to `paths.source.css`
      js: 'scripts', // The same to `paths.source.js`
      img: 'images' // The same to `paths.source.img`
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
    eslint: false,
    // Entry and Context
    entry: {},
    // Output
    filename: '[name]',
    publicPath: '', // For hot reload & building chunk dir
    chunkFilename: '',
    vendor: false, // Extract all vendors for SPA (all in one)
    vendors: [], // Custom extract vendors
    // Module
    loaders: [],
    // Resolve
    extensions: [],
    alias: {},
    // Plugins
    plugins: [],
    // DevServer
    hot: true,
    // Devtool
    sourceMap: false,
    // Target
    target: 'web',
    // Stats
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    },
    // Other Options
    extends: {} // For extra webpack config
  },
  sprites: {
    basePath: '../', // Relative to css file
    padding: 0,
    image: [], // Image folder
    mode: 'css', // Svg mode: 'css|view|defs|symbol|stack'
    svg: [] // Svg folder
  },
  extras: {
    excludes: [
      'css', 'js', 'json', 'md', 'lock' // Filename extension
    ],
    includes: [] // Filename
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
