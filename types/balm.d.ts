declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: {
      log: {
        formatOptions: {};
      };
    };
    logger: {
      debug: (obj: any, format?: boolean) => void;
      success: (label: string, message: string) => void;
      info: (label: string, message: string) => void;
      warn: (label: string, message: string) => void;
      error: (label: string, message: string) => void;
    };
    utils: {
      getType: (obj: any) => string;
      isString: (str: any) => boolean;
      isObject: (obj: any) => boolean;
      isArray: (arr: any) => boolean;
      isFunction: (fn: any) => boolean;
    };
  }
}

declare var BalmJS: NodeJS.Global;
