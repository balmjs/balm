module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: '14' },
        modules: false
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-object-rest-spread'
  ],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
};
