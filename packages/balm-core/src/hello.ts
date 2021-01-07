import { EventEmitter } from 'events';
import cacheBalmCore from './utilities/cache-core';

global.BalmJS = {
  emitter: new EventEmitter()
} as any;
BalmJS.loading = true;

cacheBalmCore();
