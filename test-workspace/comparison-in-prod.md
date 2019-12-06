# Comparison in production

- `@babel/preset-env` + (`core-js@2` | `core-js@3`)

| config                                    | Size       | ES6 |
| ----------------------------------------- | ---------- | --- |
| `{ "useBuiltIns": false, "corejs": 2 }`   | 1010 bytes | ×   |
| `{ "useBuiltIns": "entry", "corejs": 2 }` | 6.43 KiB   | √   |
| `{ "useBuiltIns": "entry", "corejs": 3 }` | 10.3 KiB   | √   |
| `{ "useBuiltIns": "usage", "corejs": 2 }` | 6.36 KiB   | √   |
| `{ "useBuiltIns": "usage", "corejs": 3 }` | 10.3 KiB   | √   |

- `@babel/plugin-transform-runtime` + (`@babel/runtime-corejs2` | `@babel/runtime-corejs3`)

| `@babel/plugin-transform-runtime` | Size       | ES6 |
| --------------------------------- | ---------- | --- |
| `{ "corejs": false }`             | 1010 bytes | ×   |
| `{ "corejs": 2 }`                 | 1010 bytes | ×   |
| `{ "corejs": 3 }`                 | 8.78 KiB   | √   |

## Min compatibility

- installing

```sh
yarn add @babel/runtime-corejs3
# OR
npm i --save @babel/runtime-corejs3
```

- config

```js
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]]
};
```

## Max compatibility

- installing

```sh
yarn add core-js
# OR
npm i --save core-js
```

- config

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime']
};
```
