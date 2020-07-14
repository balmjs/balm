import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import getCommonConfig from './common';
import { Configuration } from '@balm-core/index';

// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
const bundleAnalyzerReport = process.env.npm_config_report || false;

function getProdConfig(scripts: any): Configuration {
  const shouldUseSourceMap = scripts.sourceMap;
  const terserOptions: { ie8?: boolean } = scripts.options;

  if (scripts.ie8) {
    terserOptions.ie8 = true;
  }

  return merge(getCommonConfig(scripts), {
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
      // Keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
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
      ...(bundleAnalyzerReport ? [new BundleAnalyzerPlugin()] : [])
    ],
    devtool: shouldUseSourceMap
  });
}

export default getProdConfig;
