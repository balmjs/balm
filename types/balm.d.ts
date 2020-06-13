import { BalmConfig } from '../index';

interface BalmVendor {
  key: string;
  value: string[];
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
  replace: (
    search: string | RegExp,
    replacement: string | Function,
    options?: any
  ) => any;
}

interface Balm {
  config: BalmConfig;
  beforeTask: string | Function | undefined;
  afterTask: string | Function | undefined;
  go: (recipe?: Function) => void;
  reset: Function;
}

export default interface BalmGlobal extends Balm {
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
  toNamespace: (taskName: string | string[]) => string | string[];
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
