import { createRequire } from 'node:module';
import fs from 'node:fs';
import { URL } from 'node:url';
import { EventEmitter } from 'node:events';
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

export default balmCorePkg.version;
