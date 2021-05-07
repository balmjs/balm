import { createRequire } from 'node:module';
import { EventEmitter } from 'node:events';
import cacheBalmCore from './utilities/cache-core.js';

const requireModule = createRequire(import.meta.url);

global.BalmJS = {
  emitter: new EventEmitter()
} as any;
global.requireModule = requireModule;
BalmJS.loading = true;

cacheBalmCore();
