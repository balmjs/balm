import balm from '../lib/main';
import balmConfig from '../test-workspace/balmrc';

before(function() {
  balm.config = balmConfig;
  balm.config.useDefault = false;

  balm.go();
});
