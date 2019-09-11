declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: any;
    noop: Function;
    utils: {
      getType: (obj: any) => string;
      isString: (str: any) => boolean;
      isObject: (obj: any) => boolean;
      isArray: (arr: any) => boolean;
      isFunction: (fn: any) => boolean;
      mergeDeep: (target: any, source: any) => object;
    };
    toNamespace: (taskName: any) => string | string[];
    TIME_FLAG: string;
    BalmTask: any;
    StyleTask: any;
    beforeTask: any;
    afterTask: any;
    tasks: any[];
    recipes: any[];
    recipeIndex: number;
    run: Function;
    watchFile: string;
    plugins: any;
    file: any;
    LogLevel: {
      Trace: number;
      Debug: number;
      Info: number;
      Warn: number;
      Error: number;
      Fatal: number;
    };
    logger: {
      debug: (obj: any) => void;
      success: (label: string, message: any) => void;
      info: (label: string, message: any) => void;
      warn: (label: string, message: any) => void;
      error: (label: string, message: any) => void;
    };
  }
}

declare var BalmJS: NodeJS.Global;
