const webpack = require('webpack');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.devServer = function(options) {
  return {
    // configuation for the webpack-dev-server plugin
    devServer: {
      // defaults to localhost
      host: options.host,
      // defaults to 8080
      port: options.port,
      // remove browser status bar when running in production
      inline: true,
      // display erros only in console to limit webpack output size
      stats: 'errors-only'
    }
  }
}

exports.lintJS = function({ paths, options }) {
  return {
    // this module is merged with the babel-loader module in the commons object via
    // `webpack-merge`
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: paths,
          exclude: /node_modules/,
          // enables ESLint to run before anything else
          enforce: 'pre',
          use: [
            // eslint runs before babel
            {
              loader: 'eslint-loader',
              options: options
            }
          ]
        }
      ]
    }
  }
}
