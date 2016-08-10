'use strict';

var path = require('path');
var webpack = require("webpack");

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './index.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js'
  },

  module: {

    loaders: [{ 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]

  },

  plugins: [
    new webpack.ProvidePlugin({ $: 'jquery' })
  ],

  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    },
    root: [ "node_modules", "src" ]
  },

  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },

  watch: NODE_ENV == 'development',

  devtool: NODE_ENV == 'development' ? 'source-map' : null
};