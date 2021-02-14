const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const manifest = require('./vendor-manifest.json')

// 拆分样式文件
const extractLess = new ExtractTextPlugin({
  filename: 'style_[hash:8].css',
});

const extractCss = new ExtractTextPlugin({
  filename: 'style.less_[hash:8].css',
});

// 拆分静态库
const dllRefPlugin = new webpack.DllReferencePlugin({
  context: __dirname,
  manifest: require(path.resolve('./vendor-manifest.json')),
});

module.exports = {
  entry: [
    './index',
  ],
  // devtool: 'hidden-source-map',
  mode: 'production',
  output: {
    filename: 'bundle_[hash:8].js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    alias: {
      // dir
      resources: path.resolve(__dirname, 'resources'),
      app: path.resolve(__dirname, 'app'),
      utils: path.resolve(__dirname, 'app/utils'),
      components: path.resolve(__dirname, 'app/components'),
      router: path.resolve(__dirname, 'app/router'),
    },
  },
  module: {
    noParse:[/jquery/],
    rules: [
      {
        test: /\.m?js|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=babel']
      },
      {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: { loader: 'css-loader', options: { minimize: true }},
          publicPath: path.join(__dirname, 'dist/'),
        }),
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [{
            loader: 'css-loader',
            options: { minimize: true }
          }, {
            loader: 'less-loader',
          }],
          fallback: 'style-loader', // 在开发环境使用 style-loader
          publicPath: path.join(__dirname, 'dist/'),
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
        use: ['happypack/loader?id=url'],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    dllRefPlugin,
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory'],
    }),
    new HappyPack({
      id: 'url',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'url-loader',
          options: {
            limit: 50,
            outputPath: 'assets/',
          },
        },
      ],
    }),
    extractCss,
    extractLess,
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'template.ejs',
      inject: 'body',
      publicPath: './',
      vendor:  `dll_${manifest.name}.js`,
      minify: false
    }),
  ],

  target: 'electron-renderer',

};
