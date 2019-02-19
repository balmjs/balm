const SCRIPT_CONFIG = {
  // Entry and Context
  entry: null,
  // Output
  filename: '[name]',
  library: '',
  libraryTarget: 'var', // ['var', 'this', 'window', 'global', 'commonjs', 'commonjs2', 'amd', 'umd']
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
  // Externals
  externals: null,
  // Stats
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  // Advanced configuration
  webpack: {},
  // Other Advanced Options
  eslint: false,
  options: {
    parse: {
      // We want terser to parse ecma 8 code. However, we don't want it
      // to apply any minfication steps that turns valid ecma 5 code
      // into invalid ecma 5 code. This is why the 'compress' and 'output'
      // sections only apply transformations that are ecma 5 safe
      // https://github.com/facebook/create-react-app/pull/4234
      ecma: 8
    },
    compress: {
      ecma: 5,
      warnings: false,
      // Disabled because of an issue with Uglify breaking seemingly valid code:
      // https://github.com/facebook/create-react-app/issues/2376
      // Pending further investigation:
      // https://github.com/mishoo/UglifyJS2/issues/2011
      comparisons: false,
      // Disabled because of an issue with Terser breaking valid code:
      // https://github.com/facebook/create-react-app/issues/5250
      // Pending futher investigation:
      // https://github.com/terser-js/terser/issues/120
      inline: 2
    },
    mangle: {
      safari10: true
    },
    output: {
      ecma: 5,
      comments: false,
      // Turned on because emoji and regex is not minified properly using default
      // https://github.com/facebook/create-react-app/issues/2488
      ascii_only: true
    }
  },
  // Optimization
  optimization: {},
  vendorName: 'vendor', // AllInOne vendor filename or Vendors folder name
  extractAllVendors: false, // Extract all vendors (all in one)
  vendors: [], // Custom extract vendors (automatic setting by `scripts.entry`)
  include: [],
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run prod --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report,
  // Extract CSS
  cssLoader: true, // Use default config or custom rules for css-loader
  extractCss: {
    enabled: false,
    prefix: ''
  },
  // Loads files as `base64` encoded URL
  base64Limit: 10000
};

export default SCRIPT_CONFIG;
