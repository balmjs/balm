const balm = require('../balm');
let balmConfig = require('../balmrc');

const scripts = {
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
};

balmConfig = Object.assign(balmConfig, {
  roots: {
    source: 'ts'
  },
  scripts
});

balm.config = balmConfig;

balm.go();
