interface Path {
  isAbsolute: any;
  join: any;
  posix: any;
}

declare namespace NodeJS {
  interface Global {
    path: Path;
  }
}

declare var path: Path;

declare module '*.json' {
  const file: any;
  export = file;
}
