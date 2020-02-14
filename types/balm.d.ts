interface BalmPath {
  base: string;
  css: string;
  js: string;
  img: string;
  font: string;
  media: string;
}

interface BalmStyles {
  extname: string;
  dartSass: boolean;
  minified: boolean;
  atImportPaths: string[];
  options: object;
  sassOptions: object;
  lessOptions: object;
  postcssEnvOptions: object;
  postcssPlugins: object[];
  postcssLoaderOptions: {
    exec?: boolean;
    parser?: string | object;
    syntax?: string | object;
    stringifier?: string | object;
    config?: object;
    plugins?: object[] | Function;
    sourceMap: string | boolean;
  };
  imageBasePath: string;
  sprites: string[];
  spritePadding: number;
  spriteParams: object;
  spriteRetina: boolean;
}

interface BalmScripts {
  entry: string | string[] | { [entryChunkName: string]: string | string[] };
  library: string | object;
  libraryTarget: string;
  loaders: object[];
  includeJsResource: string[];
  defaultLoaders: {
    html?: boolean;
    css?: boolean;
    js?: boolean;
    url?: boolean;
  };
  urlLoaderOptions: object;
  extensions: string[];
  alias: object;
  plugins: object[];
  hot: boolean;
  sourceMap: string | boolean;
  target: string;
  externals: string | object | Function | RegExp;
  stats: string | object;
  webpackOptions: object;
  lint: boolean;
  options: object;
  inject: boolean;
  optimization: object;
  extractAllVendors: boolean;
  vendorName: string;
  extractCss: {
    enabled: boolean;
    prefix: string;
  };
  ie8: boolean;
}

interface BalmImages {
  defaultPlugins: {
    gif?: boolean;
    jpeg?: boolean;
    png?: boolean;
    svg?: boolean;
  };
}

interface BalmAssets {
  publicUrlPlaceholder: string;
  publicUrl: string;
  root: string;
  mainDir: string;
  subDir: string;
  buildDir: string;
  virtualDir: string;
  cache: boolean;
  options: object;
  includes: string[];
  excludes: string[];
  static: string; // Custom
}

interface ProxyConfig {
  context: string | string[];
  options: object;
}

interface BalmServer {
  port: number;
  host: string | null;
  https: boolean | undefined;
  open: string | boolean;
  localOnly: boolean;
  proxy: string | boolean | object;
  serveStatic: string[];
  options: any;
  devOptions: object;
  hotOptions: object;
  proxyConfig: boolean | ProxyConfig | ProxyConfig[];
  historyOptions: boolean | object;
  middlewares: object[];
  extraWatchFiles: string[];
}

interface BalmConfig {
  env: {
    isProd: boolean;
    isTest: boolean;
    isDev: boolean;
    inSSR: boolean;
  };
  workspace: string;
  inFrontend: boolean;
  useDefaults: boolean;
  roots: {
    source: string;
    tmp: string;
    target: string;
  };
  paths: {
    source: BalmPath;
    tmp: BalmPath;
    target: BalmPath;
  };
  html: {
    options: object;
  };
  styles: BalmStyles;
  scripts: BalmScripts;
  images: BalmImages;
  extras: {
    includes: string[];
    excludes: string[];
  };
  assets: BalmAssets;
  server: BalmServer;
  ftp: {
    options: {
      host?: string;
      port?: number;
      username?: string;
      password?: string;
      remotePath?: string;
    };
    watchFiles: string[];
  };
  pwa: {
    enabled: boolean;
    manifest: string;
    workboxSw: string;
    mode: string;
    options: object;
    swSrcFilename: string;
    swDestFilename: string;
  };
  logs: {
    level: number;
    formatOptions: object;
  };
  src?: any;
  dest?: any;
}

interface BalmVendor {
  key: string;
  value: string[];
}

interface BalmUtils {
  getType: (obj: any) => string;
  isString: (str: any) => boolean;
  isObject: (obj: any) => boolean;
  isArray: (arr: any) => boolean;
  isFunction: (fn: any) => boolean;
  deepMerge: (target: any, source: any) => object;
}

interface BalmLogger {
  success: (label: string, message: any, options?: object) => void;
  debug: (label: string, message: any, options?: object) => void;
  info: (label: string, message: any, options?: object) => void;
  warn: (label: string, message: any, options?: object) => void;
  error: (label: string, message: any, pre?: boolean) => void;
}

interface BalmFile {
  stylePaths: string[];
  publicPath: string;
  assetsSuffixPath: string;
  absPath: (path: string) => string;
  absPaths: (paths: string | string[]) => string | string[];
  matchAllFiles: (path: string, file?: string) => string;
  assetsPath: (path: string) => string;
  setPublicPath: () => any;
}

interface BalmPlugins {
  postcss: () => object[];
  plumber: (options?: any) => any;
  htmlmin: (options: any) => any;
  jsmin: (options: any) => any;
  rename: (options: any) => any;
  sftp: (options: any) => any;
}

export interface BalmModule {
  config: BalmConfig;
  beforeTask: string | Function | undefined;
  afterTask: string | Function | undefined;
  go: (recipe?: Function) => void;
  reset: Function;
}

export interface BalmGlobal extends BalmModule {
  noop: Function;
  LogLevel: {
    Trace: number;
    Debug: number;
    Info: number;
    Warn: number;
    Error: number;
  };
  vendors: BalmVendor[];
  utils: BalmUtils;
  logger: BalmLogger;
  file: BalmFile;
  toNamespace: (taskName: any) => string | string[];
  plugins: BalmPlugins;
  TIME_FLAG: string;
  BalmTask: any;
  BalmStyleTask: any;
  tasks: any[];
  recipes: any[];
  recipeIndex: number;
  server: any;
  watchFtpFile: string;
  watching: boolean;
  webpackCompiler: any;
}
