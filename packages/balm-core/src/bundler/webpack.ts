import webpack, { Configuration } from 'webpack';
import path from 'node:path';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';

export async function runWebpack(
  config: BalmConfig,
  customOptions: Configuration = {}
): Promise<webpack.Stats | undefined> {
  const isProd = config.env.isProd;

  let entry = customOptions.entry || config.scripts.entry;
  if (!entry) {
    entry = path.join(config.src.js, 'main.js');
  }

  const defaultWebpackConfig: Configuration = {
    mode: isProd ? 'production' : 'development',
    context: config.workspace,
    entry,
    output: {
      path: config.dest.js,
      filename: isProd && config.assets.cache ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd && config.assets.cache ? 'chunk/[name].[contenthash:8].js' : 'chunk/[name].js',
      publicPath: config.assets.virtualDir ? `/${config.assets.virtualDir}/` : '/'
    },
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: config.scripts.alias
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name].[hash:8][ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'font/[name].[hash:8][ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: isProd || config.scripts.minify
    },
    devtool: isProd ? false : 'eval-cheap-module-source-map'
  };

  const webpackConfig = Object.assign(
    {},
    defaultWebpackConfig,
    config.scripts.webpackOptions,
    customOptions
  );

  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err) {
        logger.error('webpack', err.stack || err);
        return reject(err);
      }

      if (stats?.hasErrors()) {
        const info = stats.toJson();
        logger.error('webpack', info.errors?.map((e) => e.message).join('\n'));
        return reject(new Error('Webpack compilation errors'));
      }

      resolve(stats);
    });
  });
}
