import fs from 'node:fs';
import path from 'node:path';
import colors from 'ansi-colors';

// Set env var for ORIGINAL cwd before anything touches it
process.env.BALM_CWD = process.env.INIT_CWD || process.cwd();
const gulpModule = `${
  process.env.BALM || process.env.BALM_CWD
}/node_modules/gulp/index.js`;

if (!fs.existsSync(gulpModule)) {
  console.error(
    colors.bgBlueBright('BalmJS'),
    colors.yellow('`balm` module not found :(')
  );
  process.exit(1);
}

// Chdir before requiring balm config to make sure
// we let them chdir as needed
if (process.cwd() !== process.env.BALM_CWD) {
  process.chdir(process.env.BALM_CWD);
}

global.path = path;
global.gulp = requireModule(gulpModule);
global.$ = requireModule('gulp-load-plugins')();
global.server = requireModule('browser-sync').create();
global.through2 = requireModule('through2');
global.PluginError = requireModule('plugin-error');
global.NOOP = () => {};
