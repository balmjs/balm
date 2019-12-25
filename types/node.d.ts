interface Path {
  basename: (path: string, ext?: string) => string;
  dirname: (path: string) => string;
  extname: (path: string) => string;
  isAbsolute: (path: string) => boolean;
  join: (...paths: string[]) => string;
  posix: any;
}

declare namespace NodeJS {
  interface Global {
    path: Path;
  }
}

declare const path: Path;

declare module '*.json' {
  const file: any;
  export = file;
}
