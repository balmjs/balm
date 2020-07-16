const isDev = true;

const balm = isDev ? require('../../packages/balm/lib') : require('balm');

module.exports = balm;
