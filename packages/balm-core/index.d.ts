export interface LooseObject {
  [key: string]: any;
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface BalmEnvObject {
  isProd: boolean;
  isTest: boolean;
  isDev: boolean;
  inSSR: boolean;
  isMP: boolean;
  inDesktopApp: boolean;
}

export interface BalmPath {
  base: string;
  html: string;
  css: string;
  js: string;
  img: string;
  font: string;
  media: string;
}

interface BalmStyles {
  extname: string;
  dartSass: boolean;
  minify: boolean;
  atImportPaths: string[];
  options: object;
  sassOptions: object;
  lessOptions: object;
  postcssEnvOptions: object;
  postcssPlugins: object[];
  imageBasePath: string;
  sprites: string[];
  spriteRetina: boolean;
  spriteParams: object;
}

// Webpack
export type Configuration = import('webpack').Configuration;
export type WebpackEntry = import('webpack').Entry;
type EntryFunc = import('webpack').EntryFunc;
export type WebpackOutput = import('webpack').Output;
export type Library = string | string[] | { [key: string]: string };
export type LibraryTarget = import('webpack').LibraryTarget;
// export type Module = import('webpack').Module;
// export type Resolve = import('webpack').Resolve;
export type ResolveAlias = { [key: string]: string };
export type ExternalsElement = import('webpack').ExternalsElement;
export type RuleSetRule = import('webpack').RuleSetRule;
export type SourceMap = import('webpack').Options.Devtool;
export type StatsValue = boolean | import('webpack').Options.Stats;
export type Optimization = import('webpack').Options.Optimization;
export type SplitChunksOptions =
  | import('webpack').Options.SplitChunksOptions
  | false;
export type Target =
  | 'web'
  | 'webworker'
  | 'node'
  | 'async-node'
  | 'node-webkit'
  | 'atom'
  | 'electron'
  | 'electron-renderer'
  | 'electron-preload'
  | 'electron-main'
  | ((compiler?: any) => void);

export interface BalmLoaders {
  html: boolean;
  css: boolean;
  js: boolean;
  url: boolean;
}
export interface PostcssLoaderOptions {
  exec?: boolean;
  postcssOptions?: object | Function; // NOTE: `postcssOptions.plugins` is the same to `styles.postcssPlugins`
  sourceMap: string | boolean;
}

// Rollup
export type RollupPlugin = import('rollup').Plugin;
export type OutputPlugin = import('rollup').OutputPlugin;
export type InputOption = import('rollup').InputOption;
export type InputOptions = import('rollup').InputOptions;
export type OutputOptions = import('rollup').OutputOptions;
export type RollupOutput = import('rollup').RollupOutput;
export type RollupBuild = import('rollup').RollupBuild;
export type WatcherOptions = import('rollup').WatcherOptions;

// Esbuild
export type BuildOptions = import('esbuild').BuildOptions;
export type TransformOptions = import('esbuild').TransformOptions;
export type TransformResult = import('esbuild').TransformResult;

// Bundler base
export type BalmBundler = 'webpack' | 'rollup' | 'esbuild';
export type MinifyOptions = import('terser').MinifyOptions;
export type BalmEntry = string | string[] | WebpackEntry | EntryFunc;

export interface BalmScripts {
  // base
  bundler: BalmBundler;
  minify: boolean;
  minifyOptions: MinifyOptions;
  entry: BalmEntry;
  lint: boolean;
  // webpack
  library: Library;
  libraryTarget: LibraryTarget;
  loaders: RuleSetRule[];
  defaultLoaders: Partial<BalmLoaders>;
  includeJsResource: string[];
  excludeUrlResource: string[];
  useEsModule: boolean;
  urlLoaderOptions: object;
  babelLoaderOptions: object;
  postcssLoaderOptions: Partial<PostcssLoaderOptions>;
  htmlLoaderOptions: object;
  extensions: string[];
  alias: ResolveAlias;
  plugins: object[];
  sourceMap: SourceMap;
  target: Target;
  externals: ExternalsElement | ExternalsElement[];
  stats: StatsValue;
  webpackOptions: Configuration;
  inject: boolean;
  optimization: Optimization;
  extractAllVendors: boolean;
  vendorName: string;
  extractCss: {
    enabled: boolean;
    prefix: string;
  };
  ie8: boolean;
  // rollup
  inputOptions: InputOptions;
  outputOptions: OutputOptions;
  watchOptions: WatcherOptions;
  // esbuild
  buildOptions: BuildOptions;
  useTransform: boolean;
  transformOptions: TransformOptions;
}

export interface BalmImagesPlugins {
  gif: boolean | Function;
  jpeg: boolean | Function;
  png: boolean | Function;
  svg: boolean | Function;
}

interface BalmImages {
  plugins: Partial<BalmImagesPlugins> | Function[];
}

export interface BalmAssetsPath extends BalmPath {
  static: string;
}

export interface BalmAssets extends Partial<BalmAssetsPath> {
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

export interface BalmProxyConfig {
  context: string | string[];
  options: object;
}

interface BalmServer {
  port: number;
  host: string | null;
  https: boolean | undefined;
  open: string | boolean;
  proxy: string | boolean | object;
  serveStatic: string[];
  options: any;
  devOptions: object;
  hotOptions: object;
  proxyConfig: boolean | BalmProxyConfig | BalmProxyConfig[];
  historyOptions: boolean | object;
  middlewares: Function[] | object[];
  extraWatchFiles: string[];
  useHMR?: boolean;
}

export interface BalmFtpConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  remotePath?: string;
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
    tmp: Omit<BalmPath, 'html'>;
    target: Omit<BalmPath, 'html'>;
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
    options: BalmFtpConfig;
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
  inDesktopApp: boolean;
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
  terser?: MinifyOptions;
  rename?: string | Function | RenameOptions;
  ftp?: BalmFtpConfig;
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
  webpack: (input: BalmEntry, output: string, options?: Configuration) => void;
  rollup: (input: InputOptions, output: OutputOptions) => void;
  esbuild: (
    input: string | string[],
    output: string,
    options?: BuildOptions | TransformOptions
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

export type BalmRecipeFunction = (parameters: Partial<BalmRecipe>) => {};

export interface Balm {
  config: DeepPartial<Omit<BalmConfig, 'src' | 'dest'>>;
  beforeTask?: string | Function;
  afterTask?: string | Function;
  go: (recipe?: BalmRecipeFunction) => void;
  reset?: Function;
}
