const path = require('path');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'ts'
  },
  scripts: {
    // Using esbuild
    // bundler: 'esbuild',
    // entry: './ts/scripts/main.ts'
    // Using webpack
    entry: {
      main: './ts/scripts/main.ts'
    },
    // FIXME: `ts-loader` bug - TypeError: times is not iterable
    loaders: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ],
    alias: {
      '@': path.resolve(__dirname, '..', '..', 'ts', 'scripts')
    }
  }
});
