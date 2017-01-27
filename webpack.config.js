/**
 * Requires
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

/**
 * Variables
 */
const Parts = require('./webpack.parts');
const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

/**
 * Common Configuration
 */
const Common = merge([
  {
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
    module: {
      rules: [
        {
          // regex pattern that matches any files with a .js or .jsx
          // file extension
          test: /\.jsx?$/,
          include: [path.join(__dirname, 'src')],
          // exclude the node_modules folder from being transpiled
          exclude: /node_modules/,
          // transform all .js and .jsx files to standard ES5 syntax
          // using the Babel loader
          loader: 'babel-loader'
        },
        {
          // regex pattern that matches any CSS files
          test: /\.css$/,
          use: [
            // injects styles into the Document as a <link>
            { loader: 'style-loader' },
            {
              // applies necessary transformations to CSS files
              loader: 'css-loader',
              options: {
                sourceMap: true,
                // enables CSS modules
                modules: true,
                // generates a unique css rule for component styles. This property is what allows
                // CSS modules to contain rules locally. You can name a CSS rule something generic
                // such as `.normal` or `.red`, and `localIdentName` will generate a unique CSS rule
                // to avoid namespace clashing
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
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
      // generates an index.html file template with
      // our bundled JavaScript injected into the bottom of the body
      new HtmlWebpackPlugin({ template: path.join(PATHS.src, 'index.html') })
    ]
  }
]);

module.exports = function(env) {
  /**
   * Production Configuration
   */
  if (env === 'production') {
    return merge([
      Common,
      Parts.lintJS({ paths: PATHS.src })
    ]);
  }
  /**
   * Develpment Configuration
   */
  return merge([
    Common,
    Parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT
    }),
    Parts.lintJS({
      paths: PATHS.src,
      options: {
        emiteWarning: true
      }
    })
  ]);
}



// module.exports = {
//   // The base directory where webpack begins
//   context: PATHS.src,
//   entry: {
//     // The context property references the source directory and tells
//     // webpack to begin there. `main` is just the key that references
//     // the starting point of the application, `index.js`
//     main: './index.js'
//   },
//   output: {
//     // `[name]` will be replaced with the key that references our
//     // entry point inside the `entry` object. In this case it will
//     // be `main`
//     filename: '[name].bundle.js',
//     path: PATHS.dist
//   },
//   module: {
//     rules: [
//       {
//         // regex pattern that matches any files with a .js or .jsx
//         // file extension
//         test: /\.jsx?$/,
//         include: [path.join(__dirname, 'src')],
//         // exclude the node_modules folder from being transpiled
//         exclude: /node_modules/,
//         // transform all .js and .jsx files to standard ES5 syntax
//         // using the Babel loader
//         loader: 'babel-loader'
//       },
//       {
//         // regex pattern that matches any CSS files
//         test: /\.css$/,
//         use: [
//           // injects styles into the Document as a <link>
//           { loader: 'style-loader' },
//           {
//             // applies necessary transformations to CSS files
//             loader: 'css-loader',
//             options: {
//               sourceMap: true,
//               // enables CSS modules
//               modules: true,
//               // generates a unique css rule for component styles. This property is what allows
//               // CSS modules to contain rules locally. You can name a CSS rule something generic
//               // such as `.normal` or `.red`, and `localIdentName` will generate a unique CSS rule
//               // to avoid namespace clashing
//               localIdentName: '[path][name]__[local]--[hash:base64:5]'
//             }
//           }
//         ]
//       }
//     ]
//   },
//   plugins: [
//     // this plugin allows for modules that get bundled 2 more more
//     // times, defined by the `minChunks` property, in multiple
//     // output files to be bundled together in a file called `common.js`.
//     // This file can then be cached on the client in order to
//     // optimize asset delivery. Only useful if we define multiple
//     // output files from multiple entry points
//     // new webpack.optimize.CommonsChunkPlugin({
//     //   name: 'commons',
//     //   filename: 'commons.js',
//     //   minChunks: 2
//     // })
//     // generates an index.html file template with
//     // our bundled JavaScript injected into the bottom of the body
//     new HtmlWebpackPlugin({ template: path.join(PATHS.src, 'index.html') })
//   ],
//   // enables sourcemaps for js modules. From webpack docs: `eval-source-maps`:
//   // 'Initially it is slow, but it provides fast rebuild speed and yields real
//   // files. Line numbers are correctly mapped since it gets mapped to the original
//   // code.' `eval-source-maps` should not be used in production.
//   devtool: 'eval-source-map'
// };
