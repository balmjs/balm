import balm from '../lib/main';
import balmConfig from './config';

console.log('Previously on BalmJS:\n', balm.config); // test get

balm.config = balmConfig; // test set

balm.go(); // test build

balm.go(); // test singleton
