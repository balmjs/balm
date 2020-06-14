// Environment
export interface BalmEnvObject {
  isProd: boolean;
  isTest: boolean;
  isDev: boolean;
  inSSR: boolean;
  isMP: boolean;
}

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
  imageBasePath: string;
  sprites: string[];
  spritePadding: number;
  spriteParams: object;
  spriteRetina: boolean;
  postcssLoaderOptions?: any;
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
  htmlLoaderOptions: object;
  postcssLoaderOptions: {
    exec?: boolean;
    parser?: string | object;
    syntax?: string | object;
    stringifier?: string | object;
    config?: object;
    plugins?: object[] | Function;
    sourceMap: string | boolean;
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
  disableDefaultLoaders?: any;
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
  middlewares: Function[] | object[];
  extraWatchFiles: string[];
}

export interface BalmConfig {
  env: BalmEnvObject;
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
    version: string;
  };
  logs: {
    level: number;
    formatOptions: object;
  };
  src?: any;
  dest?: any;
}

export interface Balm {
  config: BalmConfig;
  beforeTask: string | Function | undefined;
  afterTask: string | Function | undefined;
  go: (recipe?: Function) => void;
  reset: Function;
}