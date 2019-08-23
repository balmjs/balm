export default {
  entry: {
    main: './spa/scripts/cdn.js'
  },
  externals: {
    jquery: '$',
    lodash: '_',
    moment: 'moment'
  }
};
