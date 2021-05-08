import fs from 'node:fs';
import path from 'node:path';
import colors from 'ansi-colors';
import gulpLoadPlugins from 'gulp-load-plugins';
import { create } from 'browser-sync';
import through2 from 'through2';
import PluginError from 'plugin-error';

// Set env var for ORIGINAL cwd before anything touches it
process.env.BALM_CWD = process.env.INIT_CWD || process.cwd();
const gulpModule = path.join(
  process.env.BALM || process.env.BALM_CWD,
  'node_modules',
  'gulp',
  'index.js'
);

if (fs.existsSync(gulpModule)) {
  // Chdir before requiring balm config to make sure
  // we let them chdir as needed
  if (process.cwd() !== process.env.BALM_CWD) {
    process.chdir(process.env.BALM_CWD);
  }

  global.gulp = requireModule(gulpModule);
} else {
  console.error(
    colors.bgBlueBright('BalmJS'),
    colors.yellow('`balm` module not found :(')
  );
  process.exit(1);
}

global.path = path;
global.$ = gulpLoadPlugins();
global.server = create();
global.through2 = through2;
global.PluginError = PluginError;
global.NOOP = () => {};
