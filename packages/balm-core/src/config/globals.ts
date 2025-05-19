import path from 'node:path';
import fs from 'node:fs';
import colors from 'ansi-colors';
import { create } from 'browser-sync';
import through2 from 'through2';
import PluginError from 'plugin-error';
import semver from 'semver';

// Set env var for ORIGINAL cwd before anything touches it
process.env.BALM_CWD = process.env.INIT_CWD || process.cwd();
const gulpModule = path.join(
  process.env.BALM_ROOT || process.env.BALM_CWD,
  'node_modules',
  'gulp',
  'index.js'
);
const localSassModule = path.join(process.env.BALM_CWD, 'node_modules', 'sass');
let isLegacySass = false;
try {
  const sassPkg = requireModule(path.join(localSassModule, 'package.json'));
  isLegacySass = semver.lt(sassPkg.version, '1.40.0');
} catch (_) {}

const nodeLocalSassModule = path.join(localSassModule, 'sass.node.js');
const defaultLocalSassModule = path.join(localSassModule, 'sass.default.js'); // For `npm i -D sass <= 1.62.1`
const dartLocalSassModule = path.join(localSassModule, 'sass.dart.js'); // For `npm i -D sass <= 1.39.2`
const getSassModule = (sass: any) =>
  fs.existsSync(nodeLocalSassModule)
    ? requireModule(nodeLocalSassModule)
    : fs.existsSync(defaultLocalSassModule)
      ? requireModule(defaultLocalSassModule)
      : fs.existsSync(dartLocalSassModule)
        ? requireModule(dartLocalSassModule)
        : sass;

if (fs.existsSync(gulpModule)) {
  // Chdir before requiring balm config to make sure
  // we let them chdir as needed
  if (process.cwd() !== process.env.BALM_CWD) {
    process.chdir(process.env.BALM_CWD);
  }

  global.gulp = requireModule(gulpModule);
  global.$ = requireModule('gulp-load-plugins')();
} else {
  console.error(
    colors.bgBlueBright('BalmJS'),
    colors.yellow('`balm` module not found :(')
  );
  process.exit(1);
}

global.node = {
  path,
  fs,
  isLegacySass,
  getSassModule
};
global.server = create();
global.through2 = through2;
global.PluginError = PluginError;
global.NOOP = () => {};
