import merge from 'webpack-merge';
import getCommonConfig from './common';
import { Configuration, MinifyOptions, BalmScripts } from '@balm-core/index';

// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
const bundleAnalyzerReport = process.env.npm_config_report || false;

function getProdConfig(webpack: any, scripts: BalmScripts): Configuration {
  const TerserPlugin = require('terser-webpack-plugin');
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  const safePostCssParser = require('postcss-safe-parser');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const webpackBundleAnalyzer = require('webpack-bundle-analyzer');

  const shouldUseSourceMap = scripts.sourceMap as boolean;
  const terserOptions: MinifyOptions = scripts.minifyOptions;

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
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true
                }
              : false
          }
        })
      ]
    },
    plugins: [
      // Extract css into its own file
      ...(scripts.extractCss.enabled
        ? [
            new MiniCssExtractPlugin({
              filename: BalmJS.file.assetsPath(
                `${BalmJS.config.paths.target.css}/${scripts.extractCss.prefix}[name].css`
              ),
              chunkFilename: BalmJS.file.assetsPath(
                `${BalmJS.config.paths.target.css}/[id].css`
              )
            })
          ]
        : []),
      // View the bundle analyzer report
      ...(bundleAnalyzerReport
        ? [new webpackBundleAnalyzer.BundleAnalyzerPlugin()]
        : [])
    ],
    devtool: shouldUseSourceMap ? 'source-map' : false
  });
}

export default getProdConfig;
