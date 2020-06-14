import { Watcher } from './node';

interface GulpOptions {
  since?: Date | number | Function;
  sourcemaps?: boolean | Function;
  allowEmpty?: boolean;
}

// type GulpTaskWithAnonymous = (taskFunction: Function) => void;
type GulpTask = (taskName: string, taskFunction: Function) => void;

interface GulpTree {
  label: string;
  nodes: string[] | object[];
}

export interface Gulp {
  src: (
    globs: string | string[],
    options?: GulpOptions
  ) => NodeJS.ReadableStream;
  dest: (
    directory: string | Function,
    options?: GulpOptions
  ) => NodeJS.WritableStream;
  lastRun: (task: Function | string, precision?: number) => number | undefined;
  series: (...tasks: Function[] | string[]) => Function;
  parallel: (...tasks: Function[] | string[]) => Function;
  watch: (
    globs: string | string[],
    options?: GulpOptions,
    task?: Function | string
  ) => Watcher;
  task: GulpTask;
  tree: (options?: GulpOptions) => GulpTree;
}

export interface GulpPlugin {
  eslint: any;
  if: any;
  imagemin: any;
  less: any;
  postcss: any;
  revAll: any;
  revDeleteOriginal: any;
  sass: any;
  size: any;
  useref: any;
  zip: any;
  spritesmith: any;
}
