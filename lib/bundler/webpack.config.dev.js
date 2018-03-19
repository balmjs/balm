import commonConfig from './webpack.common';
import merge from 'webpack-merge';

const webpackConfig = merge(commonConfig, {
  mode: 'development'
});

export default webpackConfig;
