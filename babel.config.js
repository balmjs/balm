module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-object-rest-spread'
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
};
