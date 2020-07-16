module.exports = {
  origin: 'https://mp.balmjs.com',
  entry: '/(home|index)?',
  router: {
    index: ['/']
  },
  redirect: {
    notFound: 'index',
    accessDenied: 'index'
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
