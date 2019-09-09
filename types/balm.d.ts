declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    noop: Function;
    config: any;
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
    mixins: any;
    recipes: any[];
    recipeIndex: number;
    run: Function;
    plugins: any;
    file: any;
    watchFile: string;
    LogLevel: {
      Trace: number;
      Debug: number;
      Info: number;
      Warn: number;
      Error: number;
      Fatal: number;
    };
    logger: {
      debug: (obj: any, format?: boolean) => void;
      success: (label: string, message: string, format?: boolean) => void;
      info: (label: string, message: string, format?: boolean) => void;
      warn: (label: string, message: string, format?: boolean) => void;
      error: (label: string, message: string, format?: boolean) => void;
    };
  }
}

declare var BalmJS: NodeJS.Global;
