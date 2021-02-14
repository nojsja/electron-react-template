const path = require('path');
const webpack = require('webpack');

module.exports = {
  // devtool: 'source-map',
  entry: {
    vendor: [
      'prop-types',
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react',
      'antd'
    ],
  },
  mode: 'production',
  output: {
    filename: 'dll_[name]_[hash:8].js',
    library: '[name]_[hash:8]', // 将此dll包暴露到window上，给app.js调用
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    alias: {
      resources: path.resolve(__dirname, 'resources'),
      app: path.resolve(__dirname, 'app'),
      utils: path.resolve(__dirname, 'app/utils'),
      components: path.resolve(__dirname, 'app/components'),
      router: path.resolve(__dirname, 'app/router'),
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.DllPlugin({ // DllPlugin的name属性需要和libary保持一致
      name: '[name]_[hash:8]',
      path: path.join(__dirname, '[name]-manifest.json'),
      context: path.join(__dirname),
    }),
  ],
};
