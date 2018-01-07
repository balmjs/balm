## FAQ

### How to import `zepto` modules?

First, run this command in your project directory:

```sh
yarn add -D exports-loader script-loader

// OR
npm i -D exports-loader script-loader
```

Then, edit `balm` config:

```js
balm.config = {
  ...
  scripts: {
    ...
    loaders: [{
      test: /zepto\.js/,
      loader: 'exports-loader?window.Zepto!script-loader'
    }],
    alias: {
      zeptoSrc: 'zepto/src'
    }
  },
  ...
};
```

And, use it in `/path/to/main.js`.

```js
import $ from 'zeptoSrc/zepto';
import 'zeptoSrc/event';

// enjoy coding
```

### `npm@2.x.x` bug

```
Q: Error: Cannot find module 'babel-runtime/helpers/classCallCheck'

A: npm install babel-runtime
```

```
Q: Error: Cannot resolve module 'webpack-hot-middleware/client' in /path/to/your_project

A: npm install webpack-hot-middleware
```

```
Q: Error: Couldn't find preset "es2015" relative to directory "/path/to/your_project"

A: npm install babel-preset-es2015
```
