import { webpackConfig } from '../bundler/webpack.config';

const getWebpackMiddleware = () => {
  let compiler = webpack(webpackConfig());

  let middleware = [
    require('webpack-dev-middleware')(
      compiler,
      Object.assign(
        {
          publicPath: config.isProd ? config.assets.publicUrl : ''
        },
        config.server.devOptions
      )
    ),
    ...(config.scripts.hot ? [require('webpack-hot-middleware')(compiler)] : [])
  ];

  return middleware;
};

export default getWebpackMiddleware;
