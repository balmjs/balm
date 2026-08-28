import balm, { globalWorkspace, localWorkspace } from 'balm';

export default {
  config: {
    workspace: {
      local: localWorkspace(),
      global: globalWorkspace('..')
    },
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
    alias: {
      '@': localWorkspace('src')
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
