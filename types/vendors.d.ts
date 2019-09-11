declare module 'fancy-log' {
  var fancyLog: any;
  export default fancyLog;
}

declare module 'require-dir' {
  var requireDir: any;
  export default requireDir;
}

declare module 'gulp-load-plugins' {
  var $: any;
  export default $;
}

declare module 'browser-sync' {
  var browserSync: any;
  export default browserSync;
}

declare module 'postcss-import' {
  var atImport: any;
  export default atImport;
}

declare module 'postcss-preset-env' {
  var postcssPresetEnv: any;
  export default postcssPresetEnv;
}

declare module 'autoprefixer' {
  var autoprefixer: any;
  export default autoprefixer;
}

declare module 'cssnano' {
  var cssnano: any;
  export default cssnano;
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
  watch: any;
}

declare namespace NodeJS {
  interface Global {
    gulp: Igulp;
    $: any;
    server: any;
  }
}

declare var gulp: Igulp;
declare var $: any;
declare var server: any;
