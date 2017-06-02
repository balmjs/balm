import balm from '../lib/main';
import balmConfig from '../test-workspace/balmrc';

before(() => {
  balm.config = balmConfig;
  balm.config.useDefault = false;

  balm.go();
});
