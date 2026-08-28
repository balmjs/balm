import balm from 'balm';

export default {
  config: {
    roots: {
      source: 'src',
      target: 'dist'
    },
    styles: {
      extname: 'scss'
    },
    scripts: {
      bundler: 'esbuild',
      entry: './src/scripts/main.js'
    },
    assets: {
      cache: true
    }
  },
  recipes(mix) {
    if (balm.config.env.isProd) {
      mix.publish();
    }
  }
};
