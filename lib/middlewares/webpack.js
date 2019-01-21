import { webpackConfig } from '../bundler/webpack.config';

const getWebpackMiddleware = () => {
  let compiler = webpack(webpackConfig());

  let middleware = [
    ...(config.test
      ? []
      : [
          require('webpack-dev-middleware')(
            compiler,
            Object.assign(
              {
                publicPath: config.production ? config.assets.publicUrl : '',
                stats: false
              },
              config.server.devOptions
            )
          )
        ]),
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
