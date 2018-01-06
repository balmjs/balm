## Getting Started

### 0. Requirements

You need to set up your development environment before you can do anything.

Install [Node.js® and npm](https://nodejs.org/en/download/) if they are not already on your machine.

> __Verify that you are running at least node `6.x.x` and npm `3.x.x`__ by running `node -v` and `npm -v` in a terminal/console window. Older versions maybe produce errors, but newer versions are fine.

BalmJS workflow using [gulp](https://gulpjs.com/) for the build process, so you need install `gulp`.

```sh
$ npm install --global gulp-cli

# Verify
$ gulp -v
```

### 1. Installing __`balm`__

Run this command in your project directory:

```sh
$ yarn add -D gulp balm

# OR
$ npm i -D gulp balm
```

### 2. Configuration

In your project directory, create a file named `gulpfile.js` in your project root with these contents:

```js
// 1. import balm
var balm = require('balm');

// 2. config balm
balm.config = {
  // your project config
};

// 3. run balm
balm.go();
```

:page_with_curl: Refer to [our configuration docs](https://github.com/balmjs/balm/blob/master/docs/en/readme.md) to learn more about config __`balm`__.

### 3. Usage

Run the gulp command in your project directory:

```sh
# for development
$ gulp

# for production
$ gulp --production
```



## Setup

### balm@0.7.0+

```
// .babelrc
{
  "presets": ["env"],
  "plugins": ["transform-runtime"]
}
```

### balm version < 0.7.0

```
// for ES6 compilation ability
npm install --save-dev babel-preset-es2015

// for ES7 compilation ability
npm install --save-dev babel-preset-stage-0

// .babelrc
{
  "presets": ["es2015", "stage-0"]
}
```

```
// just for IE8(ES3)
npm install --save-dev babel-preset-es2015-loose
npm install --save-dev babel-plugin-transform-es3-member-expression-literals
npm install --save-dev babel-plugin-transform-es3-property-literals

// .babelrc
{
  "presets": ["es2015-loose"],
  "plugins": [
    "transform-es3-member-expression-literals",
    "transform-es3-property-literals"
  ]
}
```

### npm@2.x

```
npm -v

// just for npm2
npm install babel-runtime
npm install webpack-hot-middleware
```

## Usage

The [gulpfile.js](configuration.md) file in your project's root directory contains all of your Balm tasks.

Default, use:

```sh
# for development
$ gulp

# for production
$ gulp --production
```
