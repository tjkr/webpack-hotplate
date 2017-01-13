/**
 * Requires
 */
const HtmlWebpackPlugin = require('html-webpack-plugin'),
                   path = require('path');


/**
 * Variables
 */
const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};


/**
 * Configuration
 */
module.exports = {

  context: PATHS.src,
  
  entry: {
    // The context property references the source directory and tells
    // webpack to begin there. `main` is just the key that references
    // the starting point of the application, `index.js`
    main: './index.js'
  },

  output: {
    // `[name]` will be replaced with the key that references our
    // entry point inside the `entry` object. In this case it will
    // be `main`
    filename: '[name].bundle.js',
    path: PATHS.dist
  },

  plugins: [
    // this plugin generates an index.html file template with
    // our bundled JavaScript injected into the bottom of the body
    new HtmlWebpackPlugin({
      title: 'Webpack Demo'
    })

    // this plugin allows for modules that get bundled 2 more more
    // times, defined by the `minChunks` property, in multiple
    // output files to be bundled together in a file called `common.js`.
    // This file can then be cached on the client in order to
    // optimize asset delivery. Only useful if we define multiple
    // output files from multiple entry points
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'commons',
    //   filename: 'commons.js',
    //   minChunks: 2
    // })

  ]

}
