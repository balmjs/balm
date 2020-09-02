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
  process.env.NODE_ENV === ENV.PROD ||
  process.argv.includes(`--${ENV.PROD}`) ||
  process.argv.includes('-p');
const isTest: boolean =
  process.env.NODE_ENV === ENV.TEST ||
  process.argv.includes(`--${ENV.TEST}`) ||
  process.argv.includes('-t');
const isDev: boolean = !isProd && !isTest;

if (!process.env.NODE_ENV) {
  if (isProd) {
    process.env.NODE_ENV = ENV.PROD;
  } else if (isTest) {
    process.env.NODE_ENV = ENV.TEST;
  } else {
    process.env.NODE_ENV = ENV.DEV;
  }
}

const inSSR: boolean =
  process.env.NODE_ENV === ENV.SSR ||
  process.argv.includes(`--${ENV.SSR}`) ||
  process.argv.includes('-ssr');

const isMP: boolean =
  process.env.NODE_ENV === ENV.MP ||
  process.argv.includes(`--${ENV.MP}`) ||
  process.argv.includes('-mp');

const inDesktopApp: boolean =
  process.env.NODE_ENV === ENV.DESKTOP_APP ||
  process.argv.includes(`--${ENV.DESKTOP_APP}`) ||
  process.argv.includes('-electron');

export default {
  isProd,
  isTest,
  isDev,
  inSSR,
  isMP,
  inDesktopApp
};
