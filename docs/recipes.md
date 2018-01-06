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
