const NODE_ENV = process.env.NODE_ENV;
const argv = process.argv;
const ENV = {
  // standard
  PROD: 'production',
  TEST: 'test',
  DEV: 'development',
  // plus
  SSR: 'server',
  MP: 'miniprogram',
  DESKTOP_APP: 'desktop-app'
};

const isProd: boolean =
  NODE_ENV === ENV.PROD ||
  argv.includes(`--${ENV.PROD}`) ||
  argv.includes('-p');
const isTest: boolean =
  NODE_ENV === ENV.TEST ||
  argv.includes(`--${ENV.TEST}`) ||
  argv.includes('-t');
const isDev: boolean = !isProd && !isTest;

if (!NODE_ENV) {
  if (isProd) {
    process.env.NODE_ENV = ENV.PROD;
  } else if (isTest) {
    process.env.NODE_ENV = ENV.TEST;
  } else {
    process.env.NODE_ENV = ENV.DEV;
  }
}

const inSSR: boolean =
  NODE_ENV === ENV.SSR ||
  argv.includes(`--${ENV.SSR}`) ||
  argv.includes('-ssr');

const isMP: boolean =
  NODE_ENV === ENV.MP || argv.includes(`--${ENV.MP}`) || argv.includes('-mp');

const inDesktopApp: boolean =
  NODE_ENV === ENV.DESKTOP_APP ||
  argv.includes(`--${ENV.DESKTOP_APP}`) ||
  argv.includes('-electron');

export default {
  isProd,
  isTest,
  isDev,
  inSSR,
  isMP,
  inDesktopApp
};
