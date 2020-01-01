declare module '*.json' {
  const file: any;
  export = file;
}

declare const path: import('path').PlatformPath;

declare namespace NodeJS {
  interface Global {
    path: import('path').PlatformPath;
  }
}
