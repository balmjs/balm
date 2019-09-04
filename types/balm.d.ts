declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: any;
    utils: {
      getType: (obj: any) => string;
      isString: (str: any) => boolean;
      isObject: (obj: any) => boolean;
      isArray: (arr: any) => boolean;
      isFunction: (fn: any) => boolean;
      mergeDeep: (target: any, source: any) => object;
    };
    toNamespace: (taskName: any) => string | [];
    BalmTask: any;
    BeforeTask: any;
    AfterTask: any;
    tasks: [];
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
