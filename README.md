<div align="center">
  <a href="https://balmjs.com/">
    <img width="128" heigth="128" src="https://balmjs.com/logo.png" alt="BalmJS">
  </a>
  <br>
  <br>

[![NPM version][npm-image]][npm-url]
[![node][node-image]][node-url]
[![Dependency Status][deps-image]][deps-url]
[![Build Status][travis-image]][travis-url]
[![Build Status][appveyor-image]][appveyor-url]
[![Coverage Percentage][cover-image]][cover-url]
<br>

  <h1>BalmJS</h1>
  <p>A flexible Front-End workflow for webapps</p>
</div>

> :bell: Now, [`balm@3`](https://balm.js.org/) is ready! Upgrade and enjoy!!! :ghost:

## What's BalmJS?

BalmJS prescribes best practices and tools to help you stay productive.

## Features

- **gulp + webpack** for _any_ Front-end projects
- Automagically compile PostCSS/Sass/Less
- CSS Autoprefixing
- Automagically generation CSS sprites
- enable ES2015+ features using Babel
- Awesome images optimization
- Built-in preview server with BrowserSync
- Custom publish assets to remote (Front-end to Back-end) project
- ZIP/FTP/PWA supported

## Structure

> Returning to webapp's original nature.

```
project
├── .tmp         // Scaffolds out a temporary directory for development
├── dist         // Scaffolds out the production build
├─┬ src          // Source code in here (Create a directory in project)
│ ├── fonts
│ ├── images
│ ├── media
│ ├─┬ scripts
│ │ └── index.js // Required. A entry file for JS.
│ ├─┬ styles
│ │ └── main.css // Required. A entry file for CSS.
│ └── index.html // Required. A entry file for HTML.
├─┬ config       // Optional. But recommended. Refer to BalmCLI's templates.
│ ├── balmrc.js
│ └── publish.js
├── .dotfile     // (e.g. .gitignore, .browserslistrc, etc...)
├── babel.config.js
├── gulpfile.js  // Required. A configuration file for Balm.
├── package.json // Required.
└── ...
```

> :rocket: We recommend using [Balm CLI](https://github.com/balmjs/balm-cli) to scaffold out a front-end web app.

## Ecosystem

| Project                                               | Status                                                 | Description                                       |
| ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| [balm-cli](https://github.com/balmjs/balm-cli)        | [![NPM version][balm-cli-image]][balm-cli-url]         | :spades: BalmJS scaffolding tool                  |
| [balm-gui](https://github.com/balmjs/balm-gui)        | N/A                                                    | :clubs: GUI for BalmJS                            |
| [balm-ui-lite](https://github.com/balmjs/ui-vue-lite) | [![NPM version][balm-ui-lite-image]][balm-ui-lite-url] | :hearts: Material Design Lite + Vue               |
| [balm-ui](https://github.com/balmjs/ui-vue)           | [![NPM version][balm-ui-image]][balm-ui-url]           | :diamonds: Next Generation Material UI for Vue.js |
| [balm-scroll](https://github.com/balmjs/balm-scroll)  | [![NPM version][balm-scroll-image]][balm-scroll-url]   | :scroll: Smooth scrolling for Vue.js              |

## Demo

- [x] [Simple HTML](https://github.com/balmjs/demo-html)
- [x] [Laravel](https://github.com/balmjs/demo-laravel)
- [x] [Vue](https://github.com/balmjs/demo-vue)
- [x] [TypeScript](https://github.com/balmjs/demo-ts)
- [x] Yours awesome projects...

## Installation

### 0. Requirements

You need to set up your development environment before you can do anything.

Install [Node.js® and npm](https://nodejs.org/en/download/) if they are not already on your machine.

> **Verify that you are running at least node `10.13.x` and npm `5.2.x`** by running `node -v` and `npm -v` in a terminal/console window. Older versions maybe produce errors, but newer versions are fine.

You develop apps in the context of an [Balm workspace](https://balmjs.com/docs/guide/structure.html).

To create a new workspace and initial starter app:

```sh
# /path/to/YOUR_WORKSPACE
mkdir -p balm-project/src/{styles,scripts}
cd balm-project
npm init -y
```

:bell: BalmJS workflow using [gulp](https://gulpjs.com/) for the build process, so you need install `gulp-cli` globally and `gulp` local dependency.

```sh
yarn global add gulp-cli
yarn add -D gulp
# OR
npm install -g gulp-cli
npm install -D gulp

# Verify
$ gulp -v
# Output:
# CLI version: 2.2.0
# Local version: 4.0.0
```

### 1. Installing **`balm`**

```sh
yarn add -D balm
# OR
npm install -D balm
```

> We currently recommend using [Yarn](https://yarnpkg.com/en/docs/install) instead of npm.

### 2. Configuration

In your project directory, create a file named `gulpfile.js` in your project root with these contents:

```js
// 1. import balm
const balm = require('balm');

// 2. config balm
balm.config = {
  // Your project config
};

// 3. run & enjoy
balm.go();
```

:page_with_curl: Refer to [configuration docs](https://balmjs.com/docs/config/) to learn more about config **`balm`**.

### 3. Usage

Run the command in your project directory:

```sh
# For development
gulp

# For production
gulp --production
# OR
gulp -p
```

## [Documentation](https://balmjs.com/docs/)

- [Getting Started](https://balmjs.com/docs/guide/getting-started.html)
- [Configuration](https://balmjs.com/docs/config/)
- [Custom Task API](https://balmjs.com/docs/api/)

## License

[MIT](https://opensource.org/licenses/MIT)

© 2016-present, [Elf-mousE](http://elf-mouse.me/)

## Special Thanks to

In chronological order

- [Node.js](https://nodejs.org/)
- [gulp.js](https://gulpjs.com/)
- [webpack](https://webpack.js.org/)

[npm-image]: https://badge.fury.io/js/balm.svg
[npm-url]: https://npmjs.org/package/balm
[node-image]: https://img.shields.io/node/v/balm.svg
[node-url]: https://nodejs.org
[deps-image]: https://david-dm.org/balmjs/balm.svg?theme=shields.io
[deps-url]: https://david-dm.org/balmjs/balm
[travis-image]: https://travis-ci.org/balmjs/balm.svg?branch=master
[travis-url]: https://travis-ci.org/balmjs/balm
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/balmjs/balm?svg=true
[appveyor-url]: https://ci.appveyor.com/project/balmjs/balm
[cover-image]: https://coveralls.io/repos/balmjs/balm/badge.svg
[cover-url]: https://coveralls.io/r/balmjs/balm
[balm-cli-image]: https://badge.fury.io/js/balm-cli.svg
[balm-cli-url]: https://npmjs.org/package/balm-cli
[balm-ui-lite-image]: https://badge.fury.io/js/balm-ui-lite.svg
[balm-ui-lite-url]: https://npmjs.org/package/balm-ui-lite
[balm-ui-image]: https://badge.fury.io/js/balm-ui.svg
[balm-ui-url]: https://npmjs.org/package/balm-ui
[balm-scroll-image]: https://badge.fury.io/js/balm-scroll.svg
[balm-scroll-url]: https://npmjs.org/package/balm-scroll
