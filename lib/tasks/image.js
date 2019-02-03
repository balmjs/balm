class BalmImageTask extends BalmTask {
  get imageDist() {
    return config.isProd ? config.target.img : config.tmp.img;
  }
}

export default BalmImageTask;
