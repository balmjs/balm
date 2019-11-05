const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const workspace = path.join(projectRoot, 'test-workspace');

const balmConfig = {
  workspace
};

export default balmConfig;
