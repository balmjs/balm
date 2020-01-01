/// <reference path="index.d.ts" />

declare module 'rimraf';

declare const isWindows: boolean;
declare const balm: any;
declare const runTask: Function;
declare const expect: any;
declare const asyncCase: Function;

declare namespace NodeJS {
  interface Global {
    isWindows: boolean;
    balm: any;
    runTask: Function;
    expect: any;
    asyncCase: Function;
  }
}
