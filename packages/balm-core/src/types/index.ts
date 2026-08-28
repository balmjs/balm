export type LooseObject = Record<string, any>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type BalmEntry = string | string[] | Record<string, string | string[]>;

export interface BalmRoots {
  source: string;
  tmp: string;
  target: string;
}

export interface BalmPathMap {
  base: string;
  html: string;
  css: string;
  js: string;
  img: string;
  font: string;
  media: string;
}

export interface BalmPaths {
  source: BalmPathMap;
  tmp: Omit<BalmPathMap, 'html'>;
  target: Omit<BalmPathMap, 'html'>;
}

export interface BalmStyles {
  extname: string;
  minify: boolean;
  atImportPaths: string[];
  options: Record<string, any>;
  sassOptions: Record<string, any>;
  lessOptions: Record<string, any>;
  postcssLoaderOptions: Record<string, any>;
  postcssPlugins: any[];
  sprites: string[];
  spriteOptions: Record<string, any>;
}

export enum BundlerType {
  webpack = 'webpack',
  rollup = 'rollup',
  esbuild = 'esbuild'
}

export interface BalmScripts {
  bundler: BundlerType | 'webpack' | 'rollup' | 'esbuild';
  minify: boolean;
  minifyOptions: Record<string, any>;
  entry: BalmEntry;
  target: string | string[];
  library: string | Record<string, any>;
  libraryTarget: string;
  externals: string | string[] | Record<string, any> | RegExp | Function;
  injectHtml: boolean;
  htmlName: string;
  alias: Record<string, string>;
  plugins: any[];
  loaders: any[];
  defaultLoaders: {
    html?: boolean;
    css?: boolean;
    js?: boolean;
    url?: boolean;
  };
  options: Record<string, any>;
  esbuildOptions: Record<string, any>;
  rollupOptions: Record<string, any>;
  webpackOptions: Record<string, any>;
  useCache: boolean;
}

export interface BalmHtml {
  options: Record<string, any>;
}

export interface BalmAssets {
  root: string;
  mainDir: string;
  subDir: string;
  buildDir: string;
  virtualDir: string;
  cache: boolean;
  options: {
    fileNameManifest?: string;
    dontRenameFile?: (string | RegExp)[];
    dontUpdateReference?: (string | RegExp)[];
    hashLength?: number;
    [key: string]: any;
  };
  includes: string[];
  excludes: string[];
  static?: string;
  [key: string]: any;
}

export interface BalmServer {
  host: string | null;
  port: number;
  open: boolean | string;
  proxy: boolean | Record<string, any> | Array<Record<string, any>>;
  proxyOptions: boolean | Record<string, any> | Array<Record<string, any>>;
  historyOptions: boolean | Record<string, any>;
  useHMR: boolean;
  options: Record<string, any>;
}

export interface BalmPwa {
  enabled: boolean;
  mode: 'generateSW' | 'injectManifest';
  version: string;
  manifest: string;
  swSrcFilename: string;
  swDestFilename: string;
  options: Record<string, any>;
}

export interface BalmFtp {
  options: Record<string, any>;
  watchFiles: string[];
}

export interface BalmImages {
  plugins: any[];
}

export interface BalmEnv {
  isProd: boolean;
  isDev: boolean;
  isTest: boolean;
  inFrontend: boolean;
  inSSR: boolean;
  inDesktopApp: boolean;
  isMP: boolean;
}

export interface BalmConfig {
  workspace: string;
  env: BalmEnv;
  inFrontend: boolean;
  useDefaults: boolean;
  roots: BalmRoots;
  paths: BalmPaths;
  styles: BalmStyles;
  scripts: BalmScripts;
  html: BalmHtml;
  assets: BalmAssets;
  server: BalmServer;
  pwa: BalmPwa;
  ftp: BalmFtp;
  images: BalmImages;
  logs: {
    level: number;
  };
  src: BalmPathMap;
  dest: BalmPathMap & { static: string };
  [key: string]: any;
}

export interface RenameOptions {
  dirname?: string;
  prefix?: string;
  basename?: string;
  suffix?: string;
  extname?: string;
}

export interface ReplaceOptions {
  substr: string | RegExp;
  replacement: string | ((substring: string, ...args: any[]) => string);
}

export interface TemplateOption {
  input: string;
  output: string;
  renameOptions?: string | Function | RenameOptions;
}

export interface TaskContext {
  config: BalmConfig;
}

export type TaskFn = (context: TaskContext) => Promise<any> | any;
