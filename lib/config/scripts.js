const SCRIPT_CONFIG = {
  // Entry and Context
  entry: null,
  // Output
  filename: '[name]',
  library: '',
  libraryTarget: 'var', // ['var', 'this', 'window', 'global', 'commonjs', 'commonjs2', 'amd', 'umd']
  umdNamedDefine: false, // When using libraryTarget: "umd", setting: `true`
  chunkFilename: '',
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
  // Other Advanced Options
  webpack: {},
  eslint: false,
  options: {
    compress: {
      // Disabled because of an issue with Uglify breaking seemingly valid code:
      // https://github.com/facebookincubator/create-react-app/issues/2376
      // Pending further investigation:
      // https://github.com/mishoo/UglifyJS2/issues/2011
      comparisons: false,
      drop_console: true
    },
    output: {
      // Turned on because emoji and regex is not minified properly using default
      // https://github.com/facebookincubator/create-react-app/issues/2488
      ascii_only: true
    }
  },
  // Optimization
  optimization: {},
  vendorName: 'vendors', // AllInOne vendor filename or Vendors folder name
  extractAllVendors: false, // Extract all vendors (all in one)
  vendors: [], // Custom extract vendors (automatic setting by `scripts.entry`)
  cdn: null, // The same to `webpack.externals`
  include: [],
  // Extract CSS
  cssLoader: true, // Use default config or custom rules for css-loader
  extractCss: {
    enabled: false,
    filename: '[name].css'
  }
};

export default SCRIPT_CONFIG;
