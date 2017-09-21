import server from './server';
import roots from './roots';
import paths from './paths';
import html from './html';
import styles from './styles';
import scripts from './scripts';
import sprites from './sprites';
import extras from './extras';
import ftp from './ftp';
import assets from './assets';

const DEFAULTS = {
  debug: false,
  production: $.util.env.production || process.env.NODE_ENV === 'production',
  /**
   * Project Type
   * @type {Boolean}
   *
   * set `true` for a static HTML project
   * set `false` for a dynamic language project (e.g. PHP framework)
   */
  static: true,
  server,
  workspace: process.cwd(),
  roots,
  paths,
  html,
  styles,
  scripts,
  sprites,
  extras,
  zip: 'archive.zip', // Zip filename
  ftp,
  cache: false,
  assets,
  useDefault: true // Use balm default task
};

export default DEFAULTS;
