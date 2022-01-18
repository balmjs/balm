<div align="center">
  <a href="https://balm.js.org/">
    <img width="128" heigth="128" src="https://balm.js.org/logo.png" alt="BalmJS">
  </a>
  <br>
  <br>

[![NPM version][balm-image]][balm-url]
[![License][license-image]][license-url]
[![Coverage Percentage][cover-image]][cover-url]

  <h1>BalmJS</h1>
  <p>An universal Front-End workflow for webapps</p>
</div>

## Introduction

BalmJS prescribes best practices and tools to help you stay productive.

- **Naturally**: Make web development _simple_, _natural_ and _pleasant_.
- **Structure-Based**: _One configuration file_ can manage webapp projects with at least 90% use cases.
- **Learn Once, Run Any Webapps**: Any front-end technology stack will be developed and built in _the same way_.

## Features

- Based on **gulp + webpack** for webapp projects
- Automagically compile PostCSS/Sass/Less
- CSS Autoprefixing
- Automagically generate CSS Image Sprites
- enable ES2015+ features using Babel
- Awesome images optimization
- Built-in preview server with BrowserSync
- Custom publish assets to remote (Front-end to Back-end) project
- ZIP/FTP/PWA supported
- Easily define and extend your own tasks

## Structure

:rocket: We recommend using [Balm CLI](https://github.com/balmjs/balm-cli) to scaffold out a front-end web app.

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
├── .dotfile     // (e.g. .gitignore, .browserslistrc, etc...)
├── babel.config.js
├── balm.config.js // Required. A configuration file for Balm.
├── package.json   // Required.
└── ...
```

## Installation

### 0. Requirements

You need to set up your development environment before you can do anything.

Install [Node.js® and npm](https://nodejs.org/en/download/) if they are not already on your machine.

> **Verify that you are running at least node `12.13.0` and npm `5.2.0`** by running `node -v` and `npm -v` in a terminal/console window. Older versions maybe produce errors, but newer versions are fine.

You develop apps in the context of an [Balm workspace](https://balm.js.org/docs/guide/structure.html).

To create a new workspace and initial starter app:

```sh
# /path/to/YOUR_WORKSPACE
mkdir -p my-project/src/{styles,scripts}
echo "Hello World" > my-project/src/index.html

cd my-project
npm init -y
```

### 1. Installing `balm`

```sh
yarn global add balm-core@next
yarn add -D balm@next
```

OR

```sh
npm install -g balm-core@next
npm install -D balm@next
```

> We currently recommend using [Yarn](https://yarnpkg.com/en/docs/install) instead of npm.

### 2. Configuration

In your project directory, create a file named `balm.config.js` in your project root with these contents:

```js
module.exports = {
  // Your project config
};
```

:page_with_curl: Refer to [configuration docs](https://balm.js.org/docs/config/) to learn more about config **`balm`**.

### 3. Usage

Edit `package.json` in your project directory:

```json
{
  "scripts": {
    "dev": "balm",
    "prod": "balm -p"
  }
}
```

Run the command in your project directory:

```sh
# For development
npm run dev

# For production
npm run prod
```

## Demo

- [x] [HTML boilerplate](https://github.com/balmjs/demo-html5-boilerplate)
- [x] [Laravel](https://github.com/balmjs/demo-laravel)
- [x] [TypeScript](https://github.com/balmjs/demo-ts)
- [x] Yours awesome projects...

## Documentation

To download [example](https://balm.js.org/balm-example.zip) and try it, visit [balm.js.org](https://balm.js.org/docs/).

- [Getting Started](https://balm.js.org/docs/guide/getting-started.html)
- [Configuration](https://balm.js.org/docs/config/)
- [Custom Task API](https://balm.js.org/docs/api/)
- [Advanced Usage](https://balm.js.org/docs/advanced/)

## Ecosystem

| Project                                               | Status                                                 | Description                                                   |
| ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| **[balm-core](https://github.com/balmjs/balm)**       | [![NPM version][balm-core-image]][balm-core-url]       | :black_joker: BalmJS compiler core (required for `balm 3.0+`) |
| **[balm](https://github.com/balmjs/balm)**            | [![NPM version][balm-image]][balm-url]                 | :black_joker: BalmJS runtime core                             |
| **[balm-cli](https://github.com/balmjs/balm-cli)**    | [![NPM version][balm-cli-image]][balm-cli-url]         | :spades: BalmJS scaffolding tool                              |
| [balm-gui](https://github.com/balmjs/balm-gui)        | N/A                                                    | :clubs: GUI for BalmJS                                        |
| [balm-ui-lite](https://github.com/balmjs/ui-vue-lite) | [![NPM version][balm-ui-lite-image]][balm-ui-lite-url] | :hearts: Material Design Lite + Vue                           |
| **[balm-ui](https://github.com/balmjs/ui-vue)**       | [![NPM version][balm-ui-image]][balm-ui-url]           | :diamonds: Next Generation Material UI for Vue.js             |
| [balm-scroll](https://github.com/balmjs/balm-scroll)  | [![NPM version][balm-scroll-image]][balm-scroll-url]   | :scroll: Smooth scrolling for Vue.js                          |

## Contributing

We'd love for you to contribute and make BalmJS even better than it is today! Please make sure to read the [Contributing Guide](https://github.com/balmjs/balm/blob/master/CONTRIBUTING.md) before making a [pull request](https://github.com/balmjs/balm/pulls). You can submit any ideas as pull requests or as [GitHub issues](https://github.com/balmjs/balm/issues).

## License

[MIT](https://opensource.org/licenses/MIT)

© 2016-present, [Elf-mousE](http://elf-mouse.me/)

[balm-core-image]: https://img.shields.io/npm/v/balm-core/next.svg
[balm-core-url]: https://npmjs.org/package/balm-core
[balm-image]: https://img.shields.io/npm/v/balm/next.svg
[balm-url]: https://npmjs.org/package/balm
[license-image]: https://img.shields.io/npm/l/balm-core.svg?sanitize=true
[license-url]: https://www.npmjs.com/package/balm-core
[cover-image]: https://coveralls.io/repos/balmjs/balm/badge.svg
[cover-url]: https://coveralls.io/r/balmjs/balm
[balm-cli-image]: https://img.shields.io/npm/v/balm-cli.svg
[balm-cli-url]: https://npmjs.org/package/balm-cli
[balm-ui-lite-image]: https://img.shields.io/npm/v/balm-ui-lite.svg
[balm-ui-lite-url]: https://npmjs.org/package/balm-ui-lite
[balm-ui-image]: https://img.shields.io/npm/v/balm-ui.svg
[balm-ui-url]: https://npmjs.org/package/balm-ui
[balm-scroll-image]: https://img.shields.io/npm/v/balm-scroll.svg
[balm-scroll-url]: https://npmjs.org/package/balm-scroll
