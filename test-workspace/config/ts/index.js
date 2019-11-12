const path = require('path');
const balm = require('../balm');
const balmrc = require('../balmrc');

const balmConfig = Object.assign(balmrc, {
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

balm.config = balmConfig;

balm.go();
