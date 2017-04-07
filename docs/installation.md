# Installation & Setup

## Requirement

### [Node.js](https://nodejs.org/en/)

```sh
node -v
```

### [Gulp](http://gulpjs.com/)

```sh
npm install --global gulp-cli
```

### [Balm](http://balmjs.com/)

```sh
yarn add --dev gulp balm
# OR
npm install --save-dev gulp balm
```

## Setup

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

### TIPS

File: `package.json`

```json
...
"scripts": {
  "dev": "gulp",
  "prod": "gulp --production"
},
...
```

Then, you can use:

```sh
# for development
$ npm run dev

# for production
$ npm run prod
```
