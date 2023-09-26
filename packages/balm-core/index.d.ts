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
  minify: boolean;
  atImportPaths: string[];
  entry: string | string[];
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

// Sass
export type SassOptions = import('sass').Options<'sync'>;
export type SassImporter = import('sass').FileImporter<'sync'>;

// Webpack
export type WebpackEntry = import('webpack').Entry;
export type Configuration = import('webpack').Configuration;
export type RuleSetRule = import('webpack').RuleSetRule;

export interface BalmLoaders {
  js: boolean;
  css: boolean;
  html: boolean;
  asset: boolean;
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

// Esbuild
export type BuildOptions = import('esbuild').BuildOptions;
export type TransformOptions = import('esbuild').TransformOptions;
export type TransformResult = import('esbuild').TransformResult;

// Bundler base
export type BalmBundler = 'webpack' | 'rollup' | 'esbuild';
export type MinifyOptions = import('terser').MinifyOptions;
export type BalmEntry = string | string[] | WebpackEntry;

export interface BalmScripts {
  // base
  bundler: BalmBundler;
  minify: boolean;
  minifyOptions: MinifyOptions;
  entry: BalmEntry;
  lint: boolean;
  // webpack
  library: string | object;
  loaders: RuleSetRule[];
  defaultLoaders: Partial<BalmLoaders>;
  includeJsResource: string[];
  useEsModule: boolean;
  babelLoaderOptions: object;
  postcssLoaderOptions: Partial<PostcssLoaderOptions>;
  htmlLoaderOptions: object;
  imageAssetType: string;
  imageInlineSizeLimit: number;
  extensions: string[];
  alias: object;
  plugins: object[];
  nodeEnv: object;
  injectHtml: boolean;
  htmlPluginOptions: object;
  extractCss: boolean;
  sourceMap: string | boolean;
  target: string | string[] | false;
  externals: string | string[] | object | Function | RegExp;
  stats: object | string;
  webpackOptions: Configuration;
  optimization: object;
  extractAllVendors: boolean;
  vendorName: string;
  ie8: boolean;
  // rollup
  inputOptions: Omit<InputOptions, 'acorn'>; // incompatible
  outputOptions: OutputOptions;
  // esbuild
  buildOptions: BuildOptions;
  useTransform: boolean;
  transformOptions: TransformOptions;
  // extra
  useCache?: boolean;
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
  next: Function;
  options: any;
  devOptions: object;
  hotOptions: object;
  proxyConfig: boolean | BalmProxyConfig | BalmProxyConfig[];
  historyOptions: boolean | object;
  middlewares: Function[] | object[];
  extraWatchFiles: string[];
  // extra
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
  config: Partial<Omit<BalmConfig, 'src' | 'dest'>>;
  beforeTask?: string | Function;
  afterTask?: string | Function;
  go: (recipe?: BalmRecipeFunction) => void;
  reset?: Function;
}
