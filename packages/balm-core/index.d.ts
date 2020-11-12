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

export type BalmBundler = 'webpack' | 'rollup' | 'esbuild';
export type MinifyOptions = import('terser').MinifyOptions;

export type RuleSetRule = import('webpack').RuleSetRule;
export type Configuration = import('webpack').Configuration;
// Sync webpack
type Target = string | false | string[];
export type ResolveAlias =
  | {
      alias: Target;
      name: string;
      onlyModule?: boolean;
    }[]
  | { [index: string]: Target };
export type StatsValue =
  | boolean
  | 'none'
  | 'summary'
  | 'errors-only'
  | 'errors-warnings'
  | 'minimal'
  | 'normal'
  | 'detailed'
  | 'verbose'
  | any; // StatsOptions

export interface BalmEntryObject {
  [entryChunkName: string]: string | string[];
}

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

export type RollupPlugin = import('rollup').Plugin;
export type OutputPlugin = import('rollup').OutputPlugin;
export type InputOption = import('rollup').InputOption;
export type InputOptions = import('rollup').InputOptions;
export type OutputOptions = import('rollup').OutputOptions;
export type RollupOutput = import('rollup').RollupOutput;
export type RollupBuild = import('rollup').RollupBuild;
export type WatcherOptions = import('rollup').WatcherOptions;
export type RollupNodeResolveOptions = import('@rollup/plugin-node-resolve').RollupNodeResolveOptions;

export type BuildOptions = import('esbuild').BuildOptions;
export type TransformOptions = import('esbuild').TransformOptions;
export type TransformResult = import('esbuild').TransformResult;

export interface BalmScripts {
  // base
  bundler: BalmBundler;
  minifyOptions: MinifyOptions;
  lint: boolean;
  entry: string | string[] | BalmEntryObject; // common
  // webpack
  library: string | object;
  libraryTarget: string;
  loaders: object[];
  defaultLoaders: Partial<BalmLoaders>;
  includeJsResource: string[];
  excludeUrlResource: string[];
  useEsModule: boolean;
  urlLoaderOptions: object;
  htmlLoaderOptions: object;
  postcssLoaderOptions: Partial<PostcssLoaderOptions>;
  extensions: string[];
  alias: ResolveAlias;
  plugins: object[];
  sourceMap: string | boolean;
  target: string;
  externals: string | object | Function | RegExp;
  stats: StatsValue;
  webpackOptions: object;
  inject: boolean;
  optimization: object;
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
  nodeResolveOptions: RollupNodeResolveOptions;
  commonjsOptions: object;
  // esbuild
  buildOptions: BuildOptions;
  useTransform: boolean;
  transformOptions: TransformOptions;
}

export interface BalmImagesPlugins {
  gif: boolean;
  jpeg: boolean;
  png: boolean;
  svg: boolean;
}

interface BalmImages {
  plugins: Partial<BalmImagesPlugins> | object[];
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
    input: string | string[] | BalmEntryObject | InputOptions,
    output: string | OutputOptions,
    options?: Configuration | BuildOptions | TransformOptions // esbuild or webpack options
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
