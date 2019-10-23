/// <reference path="index.d.ts" />

declare namespace NodeJS {
  interface Global {
    isWindows: boolean;
    balm: any;
    workspace: string;
    runTask: Function;
    expect: any;
    asyncCase: Function;
  }
}

declare var isWindows: boolean;
declare var balm: any;
declare var workspace: string;
declare var runTask: Function;
declare var expect: any;
declare var asyncCase: Function;
