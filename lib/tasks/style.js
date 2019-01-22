class BalmStyleTask extends BalmTask {
  get styleTaskName() {
    return config.styles.ext === 'scss' ? 'sass' : config.styles.ext;
  }

  get stylePath() {
    return config.isProd
      ? path.join(
          config.roots.target,
          config.assets.subDir,
          config.paths.target.css
        )
      : path.join(config.roots.tmp, config.paths.tmp.css);
  }

  handleStyle(stream, output) {
    stream = config.isProd
      ? stream.pipe($.postcss([cssnano(config.styles.options)]))
      : stream.pipe($.if(!config.isProd, $.sourcemaps.write('.')));

    return stream
      .pipe(dest(BalmFile.absPaths(output)))
      .pipe(server.reload({ stream: true }));
  }

  errorHandler(error) {
    // https://github.com/floatdrop/gulp-plumber/issues/30
    logger.error('[Style Task]', error.message);
    // Must emit end event for any dependent streams to pick up on this. Destroying the stream
    // ensures nothing else in that stream gets done, for example, if we're dealing with five
    // files, after an error in one of them, any other won't carry on. Doing destroy without
    // ending it first will not notify depending streams, tasks like `watch` will hang up.
    this.emit('end');
    this.destroy();
  }
}

export default BalmStyleTask;
