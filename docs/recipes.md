## Recipes

### Optimize your command

Edit `package.json`

```json
...
"scripts": {
  "dev": "gulp",
  "prod": "gulp --production"
},
...
```

Then, you can run the command like this:

```sh
# for development
$ npm run dev

# for production
$ npm run prod
```

### For IE8 (ES3)

First, run this command in your project directory:

```sh
$ npm install --save-dev babel-preset-es2015-loose
$ npm install --save-dev babel-plugin-transform-es3-member-expression-literals
$ npm install --save-dev babel-plugin-transform-es3-property-literals
```

Then, edit `.babelrc`:

```json
{
  "presets": ["es2015-loose"],
  "plugins": [
    "transform-es3-member-expression-literals",
    "transform-es3-property-literals"
  ]
}
```
