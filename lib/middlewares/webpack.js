import { webpackConfig } from '../bundler/webpack.config';

const getWebpackMiddleware = () => {
  let compiler = webpack(webpackConfig());

  let middleware = [
    require('webpack-dev-middleware')(
      compiler,
      Object.assign(
        {
          publicPath: config.assets.publicUrl
        },
        config.server.devOptions
      )
    ),
    ...(config.scripts.hot
      ? [
          require('webpack-hot-middleware')(compiler, {
            log: false,
            path: config.server.hotOptions.path || '/__webpack_hmr'
          })
        ]
      : [])
  ];

  return middleware;
};

export default getWebpackMiddleware;
