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

  const rawOutputPath = customOptions.output?.path;
  const isCustomOutput = Boolean(rawOutputPath);
  const outputPath = isCustomOutput
    ? path.isAbsolute(rawOutputPath as string)
      ? (rawOutputPath as string)
      : path.resolve(config.workspace, rawOutputPath as string)
    : config.dest.base;

  const jsDir = isCustomOutput ? '' : isProd ? config.paths.target.js : config.paths.tmp.js;
  const imgDir = isProd ? config.paths.target.img : config.paths.tmp.img;
  const fontDir = isProd ? config.paths.target.font : config.paths.tmp.font;

  const defaultWebpackConfig: Configuration = {
    mode: isProd ? 'production' : 'development',
    context: config.workspace,
    entry,
    output: {
      path: outputPath,
      filename: isCustomOutput
        ? '[name].js'
        : isProd && config.assets.cache
          ? `${jsDir}/[name].[contenthash:8].js`
          : `${jsDir}/[name].js`,
      chunkFilename: isCustomOutput
        ? 'chunk/[name].js'
        : isProd && config.assets.cache
          ? `${jsDir}/chunk/[name].[chunkhash:8].js`
          : `${jsDir}/chunk/[name].js`,
      publicPath: config.assets.virtualDir ? `/${config.assets.virtualDir}/` : '/',
      ...(config.scripts.library ? { library: config.scripts.library as any } : {})
    },
    target: config.scripts.target || 'web',
    externals: config.scripts.externals as any,
    plugins: [
      ...(config.scripts.plugins || [])
    ],
    resolve: {
      extensions: [
        '.wasm',
        '.mjs',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.vue',
        '.json',
        ...(config.scripts.extensions || [])
      ],
      alias: {
        ...config.alias,
        ...config.scripts.alias
      }
    },
    module: {
      rules: [
        ...(config.scripts.loaders || []),
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: `${imgDir}/[name].[hash:8][ext]`
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: `${fontDir}/[name].[hash:8][ext]`
          }
        }
      ]
    },
    optimization: {
      minimize: isProd || config.scripts.minify
    },
    devtool: isProd ? false : 'eval-cheap-module-source-map'
  };

  const webpackConfig: Configuration = {
    ...defaultWebpackConfig,
    ...config.scripts.webpackOptions,
    ...customOptions,
    output: {
      ...defaultWebpackConfig.output,
      ...config.scripts.webpackOptions?.output,
      ...customOptions?.output,
      path: outputPath
    }
  };

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
