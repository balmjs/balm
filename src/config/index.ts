import './globals';
import env from './env';
import roots from './roots';
import paths from './paths';
import styles from './styles';
import scripts from './scripts';
import images from './images';
import assets from './assets';
import server from './server';
import logs from './logs';

enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5
}

const noop: Function = () => {};

/**
 * Project type
 * @type {Boolean}
 *
 * set `true` for a static HTML project
 * set `false` for a dynamic language project (e.g. PHP framework)
 */
const inFrontend = true;
const workspace: string = process.cwd();
const useDefaults = true; // Use balm default task

const config: any = {
  inFrontend,
  workspace,
  env,
  roots,
  paths,
  styles,
  scripts,
  images,
  assets,
  server,
  logs,
  useDefaults
};

global.BalmJS = {};
BalmJS.config = config;
BalmJS.noop = noop;
BalmJS.LogLevel = LogLevel;

export default config;
