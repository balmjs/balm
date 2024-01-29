import TerserPlugin, { MinimizerOptions } from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackBundleAnalyzer from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import getCommonConfig from './common.js';
import { CHUNK } from '../../../config/constants.js';
import { LooseObject, Configuration, BalmScripts } from '@balm-core/index';

// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
const bundleAnalyzerReport = process.env.npm_config_report || false;

const getCssFilename = (): string =>
  `${BalmJS.config.paths.target.css}/${CHUNK.dir}/[name].${CHUNK.hash}.css`;

function getProdConfig(
  webpack: LooseObject,
  scripts: BalmScripts
): Configuration {
  const shouldUseSourceMap = scripts.sourceMap as boolean;
  const terserOptions = scripts.minifyOptions as MinimizerOptions<{
    ie8?: boolean;
  }>;

  if (scripts.ie8) {
    terserOptions.ie8 = true;
  }

  return merge(getCommonConfig(webpack, scripts), {
    mode: 'production',
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions,
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ]
    },
    plugins: [
      // Extract css into its own file
      ...(scripts.extractCss
        ? [
            new MiniCssExtractPlugin({
              filename: BalmJS.file.assetsPath(getCssFilename()),
              chunkFilename: BalmJS.file.assetsPath(getCssFilename())
            })
          ]
        : []),
      // View the bundle analyzer report
      ...(bundleAnalyzerReport
        ? [new webpackBundleAnalyzer.BundleAnalyzerPlugin()]
        : [])
    ] as any[],
    devtool: shouldUseSourceMap ? 'source-map' : false
  });
}

export default getProdConfig;
