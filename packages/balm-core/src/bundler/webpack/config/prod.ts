import { merge } from 'webpack-merge';
import getCommonConfig from './common.js';
import { ASYNC_SCRIPTS, HASH_NAME } from '../../../config/constants.js';
import { Configuration, MinifyOptions, BalmScripts } from '@balm-core/index';

// Run the build command with an extra argument to
// View the bundle analyzer report after build finishes:
// `npm run prod --report`
// Set to `true` or `false` to always turn it on or off
const bundleAnalyzerReport = process.env.npm_config_report || false;

function getCssFilename(isChunk = false): string {
  let filename: string;

  if (isChunk) {
    filename = BalmJS.config.env.isProd ? `[id].${HASH_NAME}` : '[id]';
  } else {
    filename = BalmJS.config.env.isProd ? `[name].${HASH_NAME}` : '[name]';
  }

  return `${BalmJS.config.paths.target.css}/${ASYNC_SCRIPTS}/${filename}.css`;
}

function getProdConfig(webpack: any, scripts: BalmScripts): Configuration {
  const TerserPlugin = requireModule('terser-webpack-plugin');
  const OptimizeCSSAssetsPlugin = requireModule(
    'optimize-css-assets-webpack-plugin'
  );
  const safePostCssParser = requireModule('postcss-safe-parser');
  const MiniCssExtractPlugin = requireModule('mini-css-extract-plugin');
  const webpackBundleAnalyzer = requireModule('webpack-bundle-analyzer');

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
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }]
          }
        })
      ]
    },
    plugins: [
      // Extract css into its own file
      ...(scripts.extractCss
        ? [
            new MiniCssExtractPlugin({
              filename: BalmJS.file.assetsPath(getCssFilename()),
              chunkFilename: BalmJS.file.assetsPath(getCssFilename(true))
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
