var debug = process.env.NODE_ENV !== "production";
var webpack = require("webpack");
var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    app: ["./src/app.js"]
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          plugins: [
            'transform-decorators-legacy'
          ],
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js"
  },

  plugins: debug ? [
    new ExtractTextPlugin('[name].css')
  ] : [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ]
};
