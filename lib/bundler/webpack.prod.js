import merge from 'webpack-merge';
import UglifyJsWebpackPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCommonConfig from './webpack.common';

const getProdConfig = options => {
  const optimization = {
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true,
        parallel: true, // Uses all cores available on given machine
        sourceMap: options.sourceMap,
        uglifyOptions: options.options // = config.scripts.options
      })
    ]
  };

  return merge(getCommonConfig(options), {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      // Keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // Extract css into its own file
      ...(options.extractCss.enabled
        ? [
            new MiniCssExtractPlugin({
              filename: File.assetsPath(
                `${config.paths.target.css}/${options.extractCss.filename}`
              )
            })
          ]
        : [])
    ],
    devtool: options.sourceMap ? 'source-map' : false,
    optimization
  });
};

export default getProdConfig;
