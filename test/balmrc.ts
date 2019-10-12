const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');
const remoteRoot = path.join(workspace, 'assets');

const balmConfig = {
  workspace,
  assets: {
    root: remoteRoot
  }
};

export default balmConfig;
