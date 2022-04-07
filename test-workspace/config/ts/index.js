const env = require('../env');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'ts'
  },
  scripts: {
    // Using esbuild
    // bundler: 'esbuild',
    // entry: './ts/scripts/index.ts'
    // Using webpack
    entry: {
      main: './ts/scripts/index.ts'
    },
    // NOTE: `ts-loader` < 9.2.8 bug - TypeError: times is not iterable
    loaders: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ],
    alias: {
      '@': env.resolve('ts/scripts')
    }
  }
});
