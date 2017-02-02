# Webpack Hotplate

A lightweight, flexible [webpack](https://github.com/webpack/webpack) configuration :stew:

## Features

* ES6
* React
* ESLint
* CSS Modules
* Exclusion of unused exports via [Tree Shaking](http://www.2ality.com/2015/12/webpack-tree-shaking.html)
* Environment-specific configuration via [webpack-merge](https://github.com/survivejs/webpack-merge)

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
npm start
```

---

## Features In-depth

### ESLint

[ESLint](http://eslint.org/) is a flexible JavaScript linter that helps you define a set of syntax standards and patterns in your code. It is a helpful tool that can save you some time debugging silly syntax errors and keep your code consistent.

In order to get ESLint working with webpack, a few things need to be installed as `devDependencies`:

* `eslint`
* `eslint-loader`

The first installs `eslint` locally and the second installs the necessary webpack loader.

#### Configuration

ESLint defines a set of syntax rules and will yell at you if your code breaks them. These are defined in the `.eslintrc.json` configuration file.

You'll notice that `webpack-hotplate` uses the [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) base configuration.

```javascript
// .eslintrc.json

{
  "extends": "airbnb"
  ...
}
```

It's a good configuration to get started with, but ESLint gives you the ability to add your own rules as well. You can even override certain rules that you don't particularly care for. See more about extending configurations [here](http://eslint.org/docs/user-guide/configuring#extending-configuration-files).

##### Environments

[Environments](http://eslint.org/docs/user-guide/configuring#specifying-environments) define global variables that are predefined. They can be added to your configuration using the `env` property in `.eslintrc.json`.

```javascript
// .eslintrc.json

{
  "env": {
    "browser": true,
    "node": true,
    "commonjs": true,
    "es6": true
  }
}
```

##### Plugins

`webpack-hotplate` also uses a few ESLint plugins:

* [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/issues)
* [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
* [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)

They provide specific ESLint rules.


### CSS Modules




### Tree-shaking

One of the advantages that webpack 2 brings to the table is **tree-shaking**. Webpack analyzes all ES6 module `imports` and `exports` by combining them into a single bundle file. Inside this file, any exported module that is **not** being imported will no longer be exported. This cleans up production code by getting rid of any unused modules.

#### How is this accomplished?

This webpack configuration uses `babel-preset-es2015`. This preset bundles [many transforms](https://github.com/babel/babel/blob/master/packages/babel-preset-es2015/src/index.js) together. One of those transforms, `babel-plugin-transform-es2015-modules-commonjs`, converts ES6 code into CommonJS modules. This is not ideal, as tree-shaking is not possible with CommonJS modules. There needs to be a way to use `babel-preset-es2015` without the `commonjs` transform. Luckily, this problem can be solved by [adding another option](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015#options) to `babel-loader` in `webpack.config.js`:

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

**Note:** If you test this functionality, you may find that unused exports are still finding their way into your bundle. This is true only in `development` mode. In `production` mode, files are minified and dead code is eliminated. Unused exports will be washed away!. Run `webpack -p` in your terminal to test.

#### Extracting Babel presets out to `.babelrc`

`webpack-hotplate` takes this a step further by extracting the `presets` array from `webpack.config.js` and adding it to a seperate file in the project's root named `.babelrc`. This approach provides a better *seperation of concerns*.

```javascript
// .babelrc

{
  "presets": [
    [ "es2015", { "modules": false } ]
  ]
}
```

*Note* that the `options` object that contained `presets` is then removed from `module` in `webpack.config.js`.

### webpack-merge

Probably the most foreign part of `webpack-hotplate` to this point is the reliance of [webpack-merge](https://github.com/survivejs/webpack-merge), a tool designed to provide a more modular approach to webpack configurations.

Not all webpack configurations are created equal. There are settings that exist during `development` that shouldn't exist in `production`. One way to handle this is by creating 2 configuration files, one for each. While this works, `webpack-merge` gives us a bit more flexibility.

#### Configuration

A `Commons` object that houses "common" configuration settings between `development` and `production` is created inside of `webpack.config.js`. This object is then merged with other configuration settings depending on the `env` variable, passed via the webpack CLI.

```javascript
// wepack.config.js

const merge = require('webpack-merge');

const Common = merge([
  {
    // ... common configuration that exists in `development` and `production`
  }
]);

module.exports = function(env) {
  // Production Configuration
  if (env === 'production') {
    return merge([
      Common,
      // ... production-specific settings
    ]);
  }
  // Development Configuration
  return merge([
    Common,
    // ... development-specific configuration
  ]);
}
```

A seperate file, `webpack.parts.js`, houses seperate configuration settings that aren't "common" across evironments. Think of this file as a bucket of legos. Depending on the environment your webpack bundle is being built for (`development` or `production`), you can grab the legos you need and attach them (merge them) with the `Commons` object via `webpack-merge`.

[GitHub Repo](https://github.com/survivejs/webpack-merge)

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

[GitHub Repo](https://github.com/ampedandwired/html-webpack-plugin)

### webpack-dev-server

An Express server used **only** in development mode and provides live reloading.

#### Configuration

You can run `webpack-dev-server` through the command line, but `webpack-hotplate` opts for configuration via the `devServer` property. In most webpack configurations, this property can be found in `webpack.config.js`. However, `webpack-hotplate` uses `webpack-merge` to split configurations depending on the environment the bundle is being built for.

`webpack-dev-server` is not required in `production` configurations, only development. Therefore we can seperate the `devServer` property into `webpack.parts.js`.

```javascript
// webpack.parts.js

exports.devServer = function(options) {
  return {
    devServer: {
      host: options.host,
      port: options.port,
      inline: true,
      stats: 'errors-only'
    }
  }
}
```

This function is then run inside `webpack.config.js` depending on the environment.

```javascript
module.exports = function(env) {
  if (env === 'production') {
    // ... do production things
  }

  return merge([
    Common,
    Parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT
    }),
    // ... do more development things
  ]);
}
```

More info can be found in the [webpack 2 docs](https://webpack.js.org/configuration/dev-server/#devserver-inline-cli-only)

[GitHub Repo](https://github.com/webpack/webpack-dev-server)

## Contributing

This project is a work in progress. It's initial purpose was purely educational, but as I've begun to grasp webpack more I feel it is necessary to give back what I've learned through this repository. That is why I have prioritized documentation for certain features and plugins that have been added.

Feel free to create issues/ pull requests. If I feel that the contribution is in-line with the goal of this "boilerplate", I will gladly add it in. :ok_hand:
