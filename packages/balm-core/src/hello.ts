import { createRequire } from 'module';
import { EventEmitter } from 'events';
import fs from 'fs';
import cacheBalmCore from './utilities/cache-core.js';

const requireModule = createRequire(import.meta.url);

const balmCorePkg: {
  version: string;
} = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

global.requireModule = requireModule;
global.BalmJS = {
  version: balmCorePkg.version,
  emitter: new EventEmitter()
} as any;

BalmJS.loading = true;

cacheBalmCore();
