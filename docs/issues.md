## Common Issues

### import zepto's modules

```sh
yarn add -D exports-loader script-loader
// or
npm i --save-dev exports-loader script-loader
```

`__balmrc.js__`

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

`__/path/to/main.js__`

```js
import $ from 'zeptoSrc/zepto';
import 'zeptoSrc/event';

// enjoy coding
```

---

### npm2

Q:

```
Error: Cannot find module 'babel-runtime/helpers/classCallCheck'
```

A:

```
npm install babel-runtime
```

---

Q:

```
Error: Cannot resolve module 'webpack-hot-middleware/client' in /path/to/your_project
```

A:

```
npm install webpack-hot-middleware
```

---

Q:

```
Error: Couldn't find preset "es2015" relative to directory "/path/to/your_project"
```

A:

```
npm install babel-preset-es2015
```
