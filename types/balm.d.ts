interface Vendor {
  key: string;
  value: string[];
}

interface Utils {
  getType: (obj: any) => string;
  isString: (str: any) => boolean;
  isObject: (obj: any) => boolean;
  isArray: (arr: any) => boolean;
  isFunction: (fn: any) => boolean;
  mergeDeep: (target: any, source: any) => object;
}

interface Logger {
  debug: (obj: any, pre?: boolean) => void;
  success: (label: string, message: any, options?: object) => void;
  info: (label: string, message: any, options?: object) => void;
  warn: (label: string, message: any, options?: object) => void;
  error: (label: string, message: any, options?: object) => void;
}

declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    types: any;
    config: any;
    noop: Function;
    utils: Utils;
    toNamespace: (taskName: any) => string | string[];
    file: any;
    TIME_FLAG: string;
    BalmTask: any;
    BalmStyleTask: any;
    BalmImageTask: any;
    beforeTask: any;
    afterTask: any;
    tasks: any[];
    recipes: any[];
    recipeIndex: number;
    input: string | string[];
    output: string;
    plugins: any;
    webpackCompiler: any;
    vendors: Vendor[];
    LogLevel: {
      Trace: number;
      Debug: number;
      Info: number;
      Warn: number;
      Error: number;
      Fatal: number;
    };
    logger: Logger;
  }
}

declare var BalmJS: NodeJS.Global;
