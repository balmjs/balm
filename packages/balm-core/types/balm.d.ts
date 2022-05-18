import { BalmConfig, BalmRecipeFunction, BalmVendor } from '../index';

interface Balm {
  config: BalmConfig;
  beforeTask?: string | Function;
  afterTask?: string | Function;
  go: (recipe?: BalmRecipeFunction) => void;
  reset?: Function;
}

interface BalmUtils {
  getType: (obj: unknown) => string;
  isString: (str: unknown) => boolean;
  isObject: (obj: unknown) => boolean;
  isArray: (arr: unknown) => boolean;
  isFunction: (fn: unknown) => boolean;
  deepMerge: (target: any, source: any) => object;
}

interface BalmLogger {
  success: (label: string, message: any, options?: object) => void;
  debug: (label: string, message: any, options?: object) => void;
  info: (label: string, message: any, options?: object) => void;
  warn: (label: string, message: any, options?: object) => void;
  error: (label: string, message: any, options?: object) => void;
}

interface BalmFile {
  publicUrlOrPath: string;
  stylePaths: string[];
  assetsSuffixPath: string;
  defaultEntry: string;
  templateBasePath: string;
  absPath: (path: string) => string;
  absPaths: (paths: string | string[]) => string | string[];
  matchAllFiles: (path: string, file?: string) => string;
  assetsPath: (path: string) => string;
  setPublicPath: () => any;
}

interface BalmPlugins {
  postcss: (plugins: object[]) => any;
  postcssPlugins: (isPostCSS?: boolean) => object[];
  plumber: (options?: any) => any;
  htmlmin: (options: object) => any;
  imagemin: (plugins?: Function[]) => any;
  jsmin: (options: object) => any;
  less: (options?: object) => any;
  rename: (options: string | Function | object) => any;
  sftp: (options: object) => any;
  replace: (
    search: string | RegExp,
    replacement: string | Function,
    options?: any
  ) => any;
  sass: (options?: object) => any;
}

export default interface BalmGlobal extends Balm {
  start: [number, number];
  noop: Function;
  LogLevel: {
    Trace: number;
    Debug: number;
    Info: number;
    Warn: number;
    Error: number;
  };
  Bundler: {
    webpack: string;
    rollup: string;
    esbuild: string;
  };
  vendors: BalmVendor[];
  entries: {
    key: string;
    value: string;
  }[];
  hasHtmlWebpackPlugin: boolean;
  utils: BalmUtils;
  logger: BalmLogger;
  file: BalmFile;
  toNamespace: (taskName: string | string[]) => string | string[];
  plugins: BalmPlugins;
  BalmTask: any;
  BalmStyleTask: any;
  tasks: Map<string, any>;
  recipes: any[];
  recipeIndex: number;
  server: any;
  watchFtpFile: string;
  watching: boolean;
  webpackCompiler: any;
  loading: boolean;
  emitter: NodeJS.EventEmitter;
  useCacache: boolean;
}
