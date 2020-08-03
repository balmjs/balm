const path = require('path');
const balmrc = require('../balmrc');

module.exports = Object.assign(balmrc, {
  roots: {
    source: 'ts'
  },
  scripts: {
    entry: {
      main: './ts/scripts/main.ts'
    },
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
