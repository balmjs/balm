import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackBundleAnalyzer from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import getCommonConfig from './common.js';
import { ASYNC_SCRIPTS, HASH_NAME_PROD } from '../../../config/constants.js';
import {
  LooseObject,
  Configuration,
  MinifyOptions,
  BalmScripts
} from '@balm-core/index';

// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
const bundleAnalyzerReport = process.env.npm_config_report || false;

const getCssFilename = (): string =>
  `${BalmJS.config.paths.target.css}/${ASYNC_SCRIPTS}/[name].${HASH_NAME_PROD}.css`;

function getProdConfig(
  webpack: LooseObject,
  scripts: BalmScripts
): Configuration {
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
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
            processorOptions: {
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
          }
        })
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'production'
        )
      }),
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
    ],
    devtool: shouldUseSourceMap ? 'source-map' : false
  });
}

export default getProdConfig;
