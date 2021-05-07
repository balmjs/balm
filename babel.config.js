module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12'
        },
        loose: true,
        modules: false
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
  env: {
    test: {
      plugins: ['istanbul']
    }
  }
};
