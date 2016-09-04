const test = () => {
  config.server.open = false;

  let deps = config.production ? ['version'] : ['serve'];
  let fn = config.production ? del.bind(null, config.workspace) : () => {};
  gulp.task('gg', deps, fn);

  gulp.start('gg');
};

export default test;
