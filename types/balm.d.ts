declare namespace NodeJS {
  interface Global {
    BalmJS: any;
    config: any;
    logger: any;
  }
}

declare var BalmJS: NodeJS.Global;
