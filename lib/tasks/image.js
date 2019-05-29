class BalmImageTask extends BalmTask {
  get imageDist() {
    let staticDist = config.static
      ? config.tmp.img
      : path.join(config.target.static, config.paths.source.img);
    return config.isProd ? config.target.img : staticDist;
  }
}

export default BalmImageTask;
