import { versions } from 'process';
import { EventEmitter } from 'events';
import cacheBalmCore from './utilities/cache-core';

global.BalmJS = {
  emitter: new EventEmitter(),
  useCacache: +versions.node.split('.')[0] >= 18
} as any;

if (!BalmJS.useCacache) {
  BalmJS.loading = true;
  cacheBalmCore();
}
