/// <reference path="index.d.ts" />

declare namespace NodeJS {
  interface Global {
    balm: any;
    workspace: string;
    runTask: Function;
    expect: any;
    asyncCase: Function;
  }
}

declare var balm: any;
declare var workspace: string;
declare var runTask: Function;
declare var expect: any;
declare var asyncCase: Function;
