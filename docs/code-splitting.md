## Defining a split point

### CommonJs: `require.ensure`

```
require.ensure(dependencies, callback)
```

> synchronous `require`

Example:

```js
require.ensure(["module-a", "module-b"], function(require) {
  var a = require("module-a");
  // ...
});
```

### AMD: require

```
require(dependencies, callback)
```

> asynchronous `require`

Example:

```js
require(["module-a", "module-b"], function(a, b) {
  // ...
});
```

### ES6 Modules

> __tl;dr:__ Webpack `1.x.x` doesn’t support ES6 modules; use `require.ensure` or `require` directly depending on which module format your transpiler creates.

```js
// INVALID!!!!!!!!!
['lodash', 'backbone'].forEach(name => import name )
```

```js
//static imports
import _ from 'lodash'

// dynamic imports
require.ensure([], function(require) {
  let contacts = require('./contacts')
})
```

### `require.include`

```
require.include(request)
```

Example:

```js
require.ensure(["./file"], function(require) {
  require("./file2");
});

// is equal to

require.ensure([], function(require) {
  require.include("./file");
  require("./file2");
});
```
