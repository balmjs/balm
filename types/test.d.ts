/// <reference path="index.d.ts" />

declare namespace NodeJS {
  interface Global {
    asyncCase: Function;
  }
}

declare var asyncCase: Function;
