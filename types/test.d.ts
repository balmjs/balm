/// <reference path="index.d.ts" />

declare module 'rimraf';

declare namespace NodeJS {
  interface Global {
    isWindows: boolean;
    balm: any;
    runTask: Function;
    expect: any;
    asyncCase: Function;
  }
}

declare var isWindows: boolean;
declare var balm: any;
declare var runTask: Function;
declare var expect: any;
declare var asyncCase: Function;
