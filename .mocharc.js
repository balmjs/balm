module.exports = {
  asyncOnly: true,
  exit: true,
  timeout: 8000,
  extension: ['ts'],
  require: ['ts-node/register', 'test/setup.ts'],
  spec: ['test/index.ts']
};
