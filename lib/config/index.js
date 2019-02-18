import roots from './roots';
import paths from './paths';
import html from './html';
import styles from './styles';
import scripts from './scripts';
import sprites from './sprites';
import extras from './extras';
import server from './server';
import assets from './assets';
import ftp from './ftp';

const isProd =
  process.env.NODE_ENV === 'production' ||
  process.argv.includes('--production') ||
  process.argv.includes('-p');
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;
const inSSR =
  process.env.NODE_ENV === 'server' ||
  process.argv.includes('--server') ||
  process.argv.includes('-ssr');

const DEFAULTS = {
  debug: false,
  /**
   * Determine if balm should be triggered in a production environment.
   * @type {Boolean}
   */
  isProd,
  isTest,
  isDev,
  /**
   * Project type
   * @type {Boolean}
   *
   * set `true` for a static HTML project
   * set `false` for a dynamic language project (e.g. PHP framework)
   */
  static: true,
  workspace: process.cwd(),
  roots,
  paths,
  html,
  styles,
  scripts,
  sprites,
  extras,
  server,
  assets,
  ftp,
  cache: false,
  useDefault: true, // Use balm default task
  inSSR
};

export default DEFAULTS;
