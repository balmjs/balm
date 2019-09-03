declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: any;
    logger: any;
    utils: any;
  }
}

declare var BalmJS: NodeJS.Global;
