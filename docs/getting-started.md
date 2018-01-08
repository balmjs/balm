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

Install with npm:

```sh
$ npm install --save-dev gulp balm
```

Install with yarn:

```sh
$ yarn add --dev gulp balm
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

:page_with_curl: Refer to [our configuration docs](configuration.md) to learn more about config __`balm`__.

### 3. Usage

Run the gulp command in your project directory:

```sh
# for development
$ gulp

# for production
$ gulp --production
```

## Where do I go now?

- [Configuration](configuration.md)
- [Recipes](recipes.md)
