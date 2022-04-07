const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..');
const workspace = path.join(projectRoot, 'test-workspace');

function resolve(dir) {
  return path.join(workspace, dir);
}

module.exports = {
  workspace,
  resolve
};
