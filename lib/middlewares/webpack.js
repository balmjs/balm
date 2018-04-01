import { webpackConfig } from '../bundler/webpack.config';

const getWebpackMiddleware = () => {
  let compiler = webpack(webpackConfig());

  let middleware = [
    require('webpack-dev-middleware')(
      compiler,
      Object.assign(
        {
          publicPath: config.assets.publicUrl,
          stats: false
        },
        config.server.devOptions
      )
    ),
    ...(config.scripts.hot
      ? [
          require('webpack-hot-middleware')(
            compiler,
            Object.assign(
              {
                noInfo: true,
                reload: true
              },
              config.server.hotOptions
            )
          )
        ]
      : [])
  ];

  return middleware;
};

export default getWebpackMiddleware;
