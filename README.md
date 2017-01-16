# Webpack Hotplate

A lightweight, flexible [webpack](https://github.com/webpack/webpack) configuration.

## Features

* ES6 support via [Babel](https://github.com/babel/babel-loader)
* Exclusion of unused exports via [Tree Shaking](http://www.2ality.com/2015/12/webpack-tree-shaking.html)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

See the [in-depth](#features-in-depth) section at the end of the `README` for more details.

## Plugins

[html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)

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

## Features In-depth

### Tree-shaking

One of the advantages that webpack 2 brings to the table is **tree-shaking**. Webpack analyzes all ES6 module `imports` and `exports` by combining them into a single bundle file. Inside this file, any exported module that is **not** being imported will no longer be exported. This cleans up production code by getting rid of any unused modules.

#### How is this accomplished?

This webpack configuration uses `babel-preset-es2015`. This preset bundles [many transforms](https://github.com/babel/babel/blob/master/packages/babel-preset-es2015/src/index.js) together. One of those transforms, `babel-plugin-transform-es2015-modules-commonjs`, converts ES6 code into CommonJS modules. This is not ideal, as tree-shaking is not possible with CommonJS modules. We need a way to use `babel-preset-es2015` without the `commonjs` transform. Luckily, this problem can be solved by [adding another option](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015#options) to `babel-loader` in `webpack.config.js`:

```javascript
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

We can take this a step further by removing the `presets` array from `webpack.config.js` and adding it to a seperate file in our project root named `.babelrc`. This is just an approach that practices *seperation of concerns*.

```javascript
// .babelrc
{
  "presets": [
    [ "es2015", { "modules": false } ]
  ]
}

After doing this, we can delete the `options` property from `module.rules` in `webpack.config.js`.

```
