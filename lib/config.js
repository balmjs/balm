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
    localOnly: false, // Support environments where dynamic hostnames are not required (ie: electron)
    historyApiFallback: false
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
      css: 'styles', // Stylesheet directory: `src/styles`
      js: 'scripts', // Javascript directory: `src/scripts`
      img: 'images', // Image directory: `src/images`
      font: 'fonts' // Font directory: `src/fonts`
    },
    target: {
      base: '',
      css: 'css', // `dist/css`
      js: 'js', // `dist/js`
      img: 'img', // `dist/img`
      font: 'font' // `dist/font`
    }
  },
  html: {
    options: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  },
  styles: {
    ext: 'css', // Main style extension: 'css|scss|less'
    autoprefixer: ['last 1 version'],
    options: {
      safe: true,
      sourcemap: false,
      autoprefixer: false,
      discardComments: {
        removeAll: true
      }
    },
    includePaths: [],
    postcss: {
      plugins: [],
      // For `gulp-postcss` options
      options: {},
      // For `postcss-loader` options
      loaderOptions: {
        exec: undefined,
        parser: undefined,
        syntax: undefined,
        stringifier: undefined,
        config: undefined,
        // PostCSS Plugin: plugins: [], // The same to `styles.postcss.plugins`
        sourceMap: false
      }
    }
  },
  scripts: {
    // Entry and Context
    entry: {},
    // Output
    filename: '[name]',
    library: '',
    libraryTarget: 'var', // ['var', 'this', 'window', 'global', 'commonjs', 'commonjs2', 'amd', 'umd']
    chunkFilename: '',
    vendorName: 'vendor', // AllInOne vendor filename or Vendors folder name
    vendor: false, // Extract all vendors for SPA (all in one)
    vendors: [], // Custom extract vendors (automatic setting by `scripts.entry`)
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
    stats: 'errors-only',
    // Other Advanced Options
    webpack: {},
    eslint: false,
    options: {
      compress: {
        warnings: false
      },
      comments: false,
      minimize: true
    }
  },
  sprites: {
    basePath: '../', // Relative to css file
    padding: 1,
    image: [], // Image folder
    mode: 'css', // Svg mode: 'css|view|defs|symbol|stack'
    svg: [] // Svg folder
  },
  extras: {
    excludes: [],
    includes: []
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
    publicUrlPlaceholder: '%PUBLIC_URL%',
    publicUrl: '', // Replace `%PUBLIC_URL%/` in html templates (the same to `scripts.webpack.output.publicPath`)
    root: 'assets', // Remote project root simulation
    publicPath: 'public', // The `public` directory contains the front controller and your assets (images, JavaScript, CSS, etc.)
    subDir: '', // Public subdirectory
    options: {
      fileNameManifest: 'rev-manifest.json',
      dontRenameFile: ['.html', '.php'],
      dontUpdateReference: ['.html', '.php']
    },
    includes: [],
    excludes: []
  },
  useDefault: true // Use balm default task
};

export default DEFAULTS;
