import log from './log';

// const isProd =
//   process.env.NODE_ENV === 'production' ||
//   process.argv.includes('--production') ||
//   process.argv.includes('-p');
// const isTest =
//   process.env.NODE_ENV === 'test' ||
//   process.argv.includes('--test') ||
//   process.argv.includes('-t');
// const isDev = !isProd && !isTest;
// const inSSR =
//   process.env.NODE_ENV === 'server' ||
//   process.argv.includes('--server') ||
//   process.argv.includes('-ssr');

// if (!process.env.NODE_ENV) {
//   if (isProd) {
//     process.env.NODE_ENV = 'production';
//   } else if (isTest) {
//     process.env.NODE_ENV = 'test';
//   } else {
//     process.env.NODE_ENV = 'development';
//   }
// }

const config: any = {
  log
};

BalmJS.config = config;

export default config;
