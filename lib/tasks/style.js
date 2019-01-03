class BalmStyleTask extends BalmTask {
  get styleTaskName() {
    return config.styles.ext === 'scss' ? 'sass' : config.styles.ext;
  }

  get stylePath() {
    return config.production
      ? path.join(
          config.roots.target,
          config.assets.subDir,
          config.paths.target.css
        )
      : path.join(config.roots.tmp, config.paths.tmp.css);
  }

  handleStyle(stream, output) {
    stream = config.production
      ? stream.pipe($.postcss([cssnano(config.styles.options)]))
      : stream.pipe($.if(!config.production, $.sourcemaps.write('.')));

    return stream
      .pipe(dest(BalmFile.absPaths(output)))
      .pipe(browserSync.stream());
  }
}

export default BalmStyleTask;
