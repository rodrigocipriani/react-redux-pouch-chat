/* eslint-disable linebreak-style */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const withHash = false;
const config = {
  assetsFolder: path.resolve(__dirname, 'assets'),
  imageFolder: path.resolve(__dirname, 'assets'),
  bundleName: `[name]${withHash ? '-[hash]' : ''}.bundle.js`,
  vendorsName: `vendors${withHash ? '-[hash]' : ''}.js`,
  cssBundleName: `[name]-style${withHash ? '-[hash]' : ''}.css`,
  buildFolder: path.resolve(__dirname, 'build'),
  sourceFolder: path.resolve(__dirname, 'src'),
  entryPoint: './main.js',
  entryPointVue: './main.vue.js',
  indexHtml: path.join(__dirname, 'assets', 'index.html'),
  isProduction: process.env.NODE_ENV === 'production',
  host: '127.0.0.1',
};

console.log(config, process.env.NODE_ENV);

const webpackConfig = {
  context: config.sourceFolder,
  entry: {
    app: config.entryPoint,
    appReact: config.entryPointVue,
  },
  output: {
    path: config.buildFolder,
    // publicPath: "http://cdn.example.com/assets/[hash]/",
    filename: config.bundleName,
  },
  resolve: {
    modules: [config.sourceFolder, 'node_modules'],
  },
  watch: true,
  devtool: config.isProduction ? 'cheap-module-source-map' : 'eval',
  devServer: {
    contentBase: config.sourceFolder,
    host: '0.0.0.0',
    disableHostCheck: !config.isProduction,
  },
  module: {
    loaders: [
      {
        test: /\.vue\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            ['es2015', { modules: false }],
            // 'react',
            'stage-0',
          ],
          plugins: ['transform-vue-jsx'],
        },
        // include: [
        //   config.sourceFolder,
        // ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /\.vue\.js$/],
        query: {
          presets: [
            ['es2015', { modules: false }],
            'react',
            'stage-0',
          ],
          // plugins: ['transform-vue-jsx'],
        },
        // include: [
        //   config.sourceFolder,
        // ],
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader',
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: { importLoaders: 1 },
          }],
        }),
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({ template: config.indexHtml }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: config.vendorsName,
      minChunks: 2,
    }),
    new ExtractTextPlugin({
      filename: config.cssBundleName,
      allChunks: true,
    }),
  ],
};

module.exports = webpackConfig;
