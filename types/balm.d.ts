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
}

interface BalmScripts {
  entry: string | string[] | { [entryChunkName: string]: string | string[] };
  library: string | object;
  libraryTarget: string;
  loaders: any[];
  includeJsResource: string[];
  disableDefaultLoaders: {
    html?: boolean;
    css?: boolean;
    js?: boolean;
    url?: boolean;
  };
  extensions: string[];
  alias: object;
  plugins: object[];
  hot: boolean;
  sourceMap: string | boolean;
  target: string;
  externals: string | object | Function | RegExp;
  stats: string | object;
  webpackOptions: object;
  eslint: boolean;
  options: object;
  inject: boolean;
  optimization: object;
  splitAllVendors: boolean;
  vendorsName: string;
  bundleAnalyzerReport: any;
  extractCss: {
    enabled: boolean;
    prefix: string;
  };
  base64Limit: number;
}

interface BalmAssets {
  publicUrlPlaceholder: string;
  publicUrl: string;
  root: string;
  mainDir: string;
  subDir: string;
  buildDir: string;
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
  watchFiles: string[];
}

interface BalmConfig {
  inFrontend: boolean;
  workspace: string;
  env: {
    isProd: boolean;
    isTest: boolean;
    isDev: boolean;
    inSSR: boolean;
  };
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
  extras: {
    excludes: string[];
    includes: string[];
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
    files: string[];
  };
  pwa: {
    enabled: boolean;
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
  useDefaults: boolean;
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
  assetsPath: (path: string) => string;
  setPublicPath: () => any;
}

interface BalmPlugins {
  postcss: () => object[];
  plumber: (options: any) => any;
  htmlmin: (options: any) => any;
  jsmin: (options: any) => any;
  rename: (options: any) => any;
  sftp: (options: any) => any;
}

declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: BalmConfig;
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
    beforeTask: any;
    afterTask: any;
    recipes: any[];
    recipeIndex: number;
    server: any;
    watchFtpFile: string;
    watching: boolean;
    webpackCompiler: any;
  }
}

declare var BalmJS: NodeJS.Global;
