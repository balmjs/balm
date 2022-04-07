const DOMAIN = 'https://balm.js.org';
const HMR_PATH = '/__balm_hmr';
const PUBLIC_URL = '%PUBLIC_URL%';

const ASSETS_TYPES = ['css', 'js', 'img', 'font', 'media'];

const CHUNK = {
  dir: 'chunk',
  hash: '[contenthash:8]'
};
const ASSET = {
  dir: 'asset',
  hash: '[hash:8]',
  mpDir: 'common'
};

export { DOMAIN, HMR_PATH, PUBLIC_URL, ASSETS_TYPES, CHUNK, ASSET };
