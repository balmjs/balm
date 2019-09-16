interface Ipath {
  join: any;
  isAbsolute: any;
  posix: any;
}

declare namespace NodeJS {
  interface Global {
    path: Ipath;
  }
}

declare var path: Ipath;
