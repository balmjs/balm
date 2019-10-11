/// <reference path="index.d.ts" />

declare namespace NodeJS {
  interface Global {
    balm: any;
    balmConfigDefaults: any;
    expect: any;
    asyncCase: Function;
  }
}

declare var balm: any;
declare var balmConfigDefaults: any;
declare var expect: any;
declare var asyncCase: Function;
