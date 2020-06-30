const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 拆分样式文件
const extractCss = new ExtractTextPlugin({
  filename: 'style.css',
});

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app/index',
  ],
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      resources: path.resolve(__dirname, 'resources'),
      app: path.resolve(__dirname, 'app'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
      },
      {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: '/',
        }),
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          publicPath: '/',
          use: [{
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.(png|jpg|gif|svg|ico|woff|eot|ttf|woff2|icns)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    extractCss,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    historyApiFallback: true,
    hot: true,
  },
  target: 'electron-renderer',
};
