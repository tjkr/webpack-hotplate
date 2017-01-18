# Webpack Hotplate

A lightweight, flexible [webpack](https://github.com/webpack/webpack) configuration :stew:

## Features

* ES6 support via [Babel](https://github.com/babel/babel-loader)
* Exclusion of unused exports via [Tree Shaking](http://www.2ality.com/2015/12/webpack-tree-shaking.html)
* React

*[Features In-Depth](#features-in-depth)*

## Plugins

* [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

*[Plugins In-Depth](#plugins-in-depth)*

## Getting Started

#### Clone repo

```
git clone git@github.com:jake-wies/webpack-hotplate.git

cd webpack-hotplate
```

#### Install dependencies

```
npm install
```

#### Develop!

```
npm run build
```

---

## Features In-depth

### Tree-shaking

One of the advantages that webpack 2 brings to the table is **tree-shaking**. Webpack analyzes all ES6 module `imports` and `exports` by combining them into a single bundle file. Inside this file, any exported module that is **not** being imported will no longer be exported. This cleans up production code by getting rid of any unused modules.

#### How is this accomplished?

This webpack configuration uses `babel-preset-es2015`. This preset bundles [many transforms](https://github.com/babel/babel/blob/master/packages/babel-preset-es2015/src/index.js) together. One of those transforms, `babel-plugin-transform-es2015-modules-commonjs`, converts ES6 code into CommonJS modules. This is not ideal, as tree-shaking is not possible with CommonJS modules. We need a way to use `babel-preset-es2015` without the `commonjs` transform. Luckily, this problem can be solved by [adding another option](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015#options) to `babel-loader` in `webpack.config.js`:

```javascript
//webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.jsx?$/,

        include: [
          path.join(__dirname, 'src')
        ],

        exclude: [
          path.join(__dirname, 'node_modules')
        ],

        loader: 'babel-loader',

        options: {
          presets: [
            [ 'es2015', {"modules": false} ] // the secret sauce!
          ]
        }
      }  
    ]
  }
}
```

According to the `babel-preset-es2015` documentation:

> * `modules` - Enable transformation of ES6 module syntax to another module type (Enabled by default to `"commonjs"`).
>   * Can be `false` to not transform modules, or one of `["amd", "umd", "systemjs", "commonjs"]`

Adding `{"modules": false}` should prevent ES6 modules from being transformed to `commonJS` modules, giving webpack its coveted tree-shaking ability!

**Note:** If you test this functionality, you may find that unused exports are still finding their way in to your bundle. This is true only in development mode. In production mode, files are minified and dead code is eliminated. Unused exports will be washed away!. Run `webpack -p` in your terminal to test.

#### Extracting Babel presets out to `.babelrc`

We can take this a step further by removing the `presets` array from `webpack.config.js` and adding it to a seperate file in our project root named `.babelrc`. This is approach gives us a better *seperation of concerns*.

```javascript
// .babelrc
{
  "presets": [
    [ "es2015", { "modules": false } ]
  ]
}
```

We can then delete the `options` property from `module.rules` in `webpack.config.js`.

---

## Plugins In-depth

### html-webpack-plugin

The `html-webpack-plugin` generates an `index.html` file and includes the bundles emitted by webpack in `<body>`. `index.html` is then placed in `output.path`, which is defined in `webpack.config.js`.

#### Configuration

* `template` - An `index.html` file, located in `src`, is passed to `html-webpack-plugin` and used as a template for the output `dist/index.html`.

```javascript
// webpack.config.js

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(PATHS.src, 'index.html') })
  ]  
}
```

[Link to GitHub Repo](https://github.com/ampedandwired/html-webpack-plugin)

### webpack-dev-server

An Express server used **only** in development mode and provides live reloading.

#### Configuration

You can run `webpack-dev-server` through the command line, but this boilerplate opts for configuration via the `devServer` property in `webpack.config.js`. The options passed to the `devServer` property will be picked up by `webpack-dev-server`:

* `compress` - enables gzip compression
* `port` - Specifies which port to listen for requests
* `inline` - Recommended for Hot Module Replacement. Currently the only way I know how to remove the `App Ready` status bar from the top of the browser.

```javascript
// webpack.config.js

module.exports = {
  ...
  devServer: { compress: true, port: 3000, inline: true }
}
```

More info in the [webpack 2 docs](https://webpack.js.org/configuration/dev-server/#devserver-inline-cli-only)

[Link to GitHub Repo](https://github.com/webpack/webpack-dev-server)

## Contributing

This project is a work in progress. It's initial purpose was purely educational, but as I've begun to grasp webpack more I feel it is necessary to give back what I've learned through this repository. That is why I have prioritized documentation for certain features and plugins that have been added.

Feel free to create issues/ pull requests. If I feel that the contribution is in-line with the goal of this "boilerplate", I will gladly add it in. :ok_hand:
