const balm = require('../balm');
const webDir = './dist/web';
const mpDir = './dist/mp';
const mpCommonDir = `${mpDir}/common`;
const replaceOptions = [
  {
    substr: /(\.weui-article \*,)|(\*{margin:0;padding:0})|(\.weui-article \*{max-width:100%;box-sizing:border-box})/g,
    replacement: ''
  },
  {
    substr: /class\*=weui-icon-/g,
    replacement: 'class^=weui-icon-'
  }
];

module.exports = function fuckMP(mix) {
  if (mix.env.isMP && mix.env.isProd) {
    // For external css
    mix.copy(
      `${webDir}/${balm.config.paths.target.css}/*`,
      `${mpCommonDir}/${balm.config.paths.target.css}`,
      {
        rename: {
          extname: '.wxss'
        }
      }
    );

    // Fix MP bug
    mix.replace(
      `${mpCommonDir}/${balm.config.paths.target.css}/*.wxss`,
      `${mpCommonDir}/${balm.config.paths.target.css}`,
      replaceOptions
    );

    // For css entry
    mix.copy('./mp/index.wxss', `${mpDir}/pages/main`);
  }
};
