export default {
  entry: {
    main: './src/scripts/cdn.js'
  },
  externals: {
    jquery: '$',
    lodash: '_',
    moment: 'moment'
  }
};
