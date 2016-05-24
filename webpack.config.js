var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/app.js",


  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        }
      }
    ]
  },

  output: {
    filename: "public/app.min.js"
  },

  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
