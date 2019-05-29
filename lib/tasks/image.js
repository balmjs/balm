class BalmImageTask extends BalmTask {
  get imageDist() {
    return config.isProd || !config.static ? config.target.img : config.tmp.img;
  }
}

export default BalmImageTask;
