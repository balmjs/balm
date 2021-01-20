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
    globalVars: [
      ['TEST_VAR_STRING', "'miniprogram'"],
      ['TEST_VAR_NUMBER', '123'],
      ['TEST_VAR_BOOL', 'true'],
      ['TEST_VAR_FUNCTION', "function() {return 'I am function'}"],
      ['TEST_VAR_OTHERS', 'window.document'],
      ['open']
    ],
    autoBuildNpm: 'npm'
  },
  app: {
    navigationBarTitleText: 'BalmJS for MP'
  },
  global: {
    rem: true
  },
  projectConfig: {
    appid: '',
    projectname: 'vue-wechat-mp'
  },
  packageConfig: {
    author: 'BalmJS'
  }
};
