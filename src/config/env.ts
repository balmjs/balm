const ENV = {
  PROD: 'production',
  TEST: 'test',
  DEV: 'development',
  SSR: 'server',
  MP: 'miniprogram'
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

export default {
  isProd,
  isTest,
  isDev,
  inSSR,
  isMP
};
