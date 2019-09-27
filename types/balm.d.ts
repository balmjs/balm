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
  mergeDeep: (target: any, source: any) => object;
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
  assetsPath: (path: string) => string;
}

interface BalmPlugins {
  postcss: () => object[];
  htmlmin: (options: any) => any;
  rename: (options: any) => any;
  sftp: (options: any) => any;
}

declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: any;
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
    BalmImageTask: any;
    tasks: any[];
    beforeTask: any;
    afterTask: any;
    recipes: any[];
    recipeIndex: number;
    watching: boolean;
    webpackCompiler: any;
  }
}

declare var BalmJS: NodeJS.Global;
