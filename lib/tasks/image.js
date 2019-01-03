class BalmImageTask extends BalmTask {
  get imageDist() {
    return config.production ? config.target.img : config.tmp.img;
  }
}

export default BalmImageTask;
