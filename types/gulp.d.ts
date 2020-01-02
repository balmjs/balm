export interface Gulp {
  src: (globs: string | string[], options?: object) => any;
  dest: (directory: string | Function, options?: object) => any;
  lastRun: (task: string | Function, precision?: number) => any;
  series: any;
  parallel: any;
  watch: (
    globs: string | string[],
    options?: object,
    task?: string | Function
  ) => any;
  task: (taskName: string, taskFunction: Function) => any;
  tree: (options?: object) => any;
}

export interface GulpPlugins {
  eslint: any;
  if: any;
  imagemin: any;
  less: any;
  postcss: any;
  replace: any;
  revAll: any;
  revDeleteOriginal: any;
  sass: any;
  size: any;
  useref: any;
  zip: any;
  spritesmith: any;
}
