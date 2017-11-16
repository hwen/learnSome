
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './example/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'example.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      showErrors: true,
      inject: true,
      template: path.resolve(__dirname, '../example/index.html')
    }),
    new ExtractTextPlugin('style.css')
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    // historyApiFallback: true, 
    compress: true,
    port: 8080
  }
}
