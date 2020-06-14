export interface LooseObject {
  [key: string]: any;
}

export interface BalmEnvObject {
  isProd: boolean;
  isTest: boolean;
  isDev: boolean;
  inSSR: boolean;
  isMP: boolean;
}

export interface BalmPath {
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

export interface BalmEntryObject {
  [entryChunkName: string]: string | string[];
}

interface BalmScripts {
  entry: string | string[] | BalmEntryObject;
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

export interface BalmAssetsPath extends BalmPath {
  static: string;
}

interface BalmAssets extends BalmAssetsPath {
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
}

export interface ProxyConfig {
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
  src: BalmPath;
  dest: BalmAssetsPath;
}

export interface BalmVendor {
  key: string;
  value: string[];
}

export interface RenameOptions {
  dirname?: string;
  prefix?: string;
  basename?: string;
  suffix?: string;
  extname?: string;
}

export interface HookOptions {
  src?: object;
  sass?: object;
  less?: object;
  terser?: object;
  rename?: string | Function | RenameOptions;
  ftp?: object;
}

export interface SpriteOptions {
  extname?: string;
  imageBasePath?: string;
  imageTarget?: string; // NOTE: overwrite `balm.config.paths.target.img`
  spriteRetina?: boolean;
  spriteParams?: object;
}

export interface ReplaceOptions {
  substr: string | RegExp;
  replacement: string | Function;
}

export interface TemplateOption {
  input: string;
  output: string;
  renameOptions: string | Function | RenameOptions;
}

export interface BalmError extends Error {
  code: string;
  details?: string;
}

interface BalmRecipe {
  env: BalmEnvObject;
  html: (input: string, output: string) => void;
  css: (input: string | string[], output: string) => void;
  sass: (
    input: string | string[],
    output: string,
    options?: HookOptions
  ) => void;
  less: (
    input: string | string[],
    output: string,
    options?: HookOptions
  ) => void;
  url: (input: string | string[], output: string) => void;
  js: (
    input: string | string[] | BalmEntryObject,
    output: string,
    webpackOptions?: any
  ) => void;
  jsmin: (
    input: string | string[],
    output: string,
    options?: HookOptions
  ) => void;
  copy: (
    input: string | string[],
    output: string,
    options?: HookOptions
  ) => void;
  remove: (paths: string | string[]) => void;
  version: (
    input: string | string[],
    output: string,
    assetsOptions?: object
  ) => void;
  serve: (handler: Function) => void;
  sprite: (
    input: string[],
    output: string,
    spriteOptions?: SpriteOptions
  ) => void;
  replace: (
    input: string | string[],
    output: string,
    options: ReplaceOptions | ReplaceOptions[]
  ) => void;
  publish: (
    input: string | TemplateOption[],
    output: string,
    renameOptions?: string | Function | RenameOptions
  ) => void;
  zip: (input: string | string[], output?: string, filename?: string) => void;
  ftp: (localFiles: string, options?: HookOptions) => void;
  generateSW: (pwaOptions: object) => void;
  injectManifest: (pwaOptions: object) => void;
  modernizr: () => void;
}

export interface Balm {
  config: BalmConfig;
  beforeTask: string | Function | undefined;
  afterTask: string | Function | undefined;
  go: (recipe?: BalmRecipe) => void;
  reset: Function;
}
