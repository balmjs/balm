import balm from '../lib/main';
import balmConfig from './balm.config';
import testConfig from './config';

console.log('Previously on BalmJS:\n', balm.config); // test get

balm.config = balmConfig; // test set

// test build
balm.go(function(mix) {
  mix.publish();
});

balm.go(); // test singleton

testConfig(balm.config);
