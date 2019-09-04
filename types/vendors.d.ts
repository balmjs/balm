declare module 'fancy-log' {
  var fancyLog: any;
  export default fancyLog;
}

declare module 'require-dir' {
  var requireDir: any;
  export default requireDir;
}

declare module 'gulp' {
  var gulp: any;
  export default gulp;
  export var tree: any;
}

interface Igulp {
  task: any;
  src: any;
  dest: any;
  series: any;
  parallel: any;
}

declare namespace NodeJS {
  interface Global {
    gulp: Igulp;
  }
}

declare var gulp: Igulp;
