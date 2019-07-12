import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import getCommonConfig from './webpack.common';

const getProdConfig = options => {
  let shouldUseSourceMap = options.sourceMap;

  let optimization = {
    minimizer: [
      new TerserPlugin({
        terserOptions: options.options,
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: shouldUseSourceMap
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
  };

  return merge(getCommonConfig(options), {
    mode: 'production',
    plugins: [
      // Keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // Extract css into its own file
      ...(options.extractCss.enabled
        ? [
            new MiniCssExtractPlugin({
              filename: BalmFile.assetsPath(
                `${config.paths.target.css}/${options.extractCss.prefix}[name].css`
              ),
              chunkFilename: BalmFile.assetsPath(
                `${config.paths.target.css}/[id].css`
              )
            })
          ]
        : []),
      // View the bundle analyzer report
      ...(config.scripts.bundleAnalyzerReport
        ? [new BundleAnalyzerPlugin()]
        : [])
    ],
    devtool: shouldUseSourceMap ? 'source-map' : false,
    optimization
  });
};

export default getProdConfig;
