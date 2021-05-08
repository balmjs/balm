import { createRequire } from 'module';
import { EventEmitter } from 'events';
import cacheBalmCore from './utilities/cache-core.js';

const requireModule = createRequire(import.meta.url);

global.BalmJS = {
  emitter: new EventEmitter()
} as any;
global.requireModule = requireModule;
BalmJS.loading = true;

cacheBalmCore();
