interface Path {
  join: any;
  isAbsolute: any;
  posix: any;
}

declare namespace NodeJS {
  interface Global {
    path: Path;
  }
}

declare var path: Path;
