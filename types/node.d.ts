interface Ipath {
  join: any;
}

declare namespace NodeJS {
  interface Global {
    path: Ipath;
  }
}

declare var path: Ipath;
