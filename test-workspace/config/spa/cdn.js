export default {
  entry: {
    main: './src/scripts/spa/cdn.js'
  },
  externals: {
    jquery: '$',
    lodash: '_',
    moment: 'moment'
  }
};
