module.exports = {
  origin: 'https://mp.balmjs.com',
  entry: '/',
  router: {
    main: ['/'] // NOTE: `main` 必须与 `balmrc.js` 中的 `scripts.entry` 入口文件输出名保持一致
  },
  redirect: {
    notFound: 'main',
    accessDenied: 'main'
  },
  generate: {
    autoBuildNpm: false
  },
  app: {
    navigationBarTitleText: 'BalmJS for MP'
  },
  appExtraConfig: {
    useExtendedLib: {
      kbone: true
    }
  },
  global: {
    rem: true
  },
  optimization: {
    wxssUniversalSelector: 'classprefix'
  },
  projectConfig: {
    appid: '',
    projectname: 'com.balmjs.mp'
  },
  packageConfig: {
    author: 'BalmJS'
  }
};
