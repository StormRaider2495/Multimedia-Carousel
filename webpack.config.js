 var path = require('path');
 var webpack = require('webpack');

 module.exports = {

     entry: path.resolve(__dirname, './src/js/index.js'),
     output: {
         path: path.resolve(__dirname, './build/'),
         filename: 'multimedia-carousel.bundle.js'
     },
     module: {
         loaders: [{
             test: /\.js$/,
             loader: 'babel-loader',
             query: {
                 presets: ['es2015']
             }
         }]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map',
     watch: true  
 };
