import roots from './roots';
import paths from './paths';
import html from './html';
import styles from './styles';
import scripts from './scripts';
import sprites from './sprites';
import extras from './extras';
import server from './server';
import ftp from './ftp';
import assets from './assets';
import logger from '../helpers/logger';

const DEFAULTS = {
  debug: false,
  /**
   * Determine if balm should be triggered in a production environment.
   * @type {Boolean}
   */
  production: (process.env.NODE_ENV === 'production' || process.argv.includes('-p')),
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
  zip: 'archive.zip', // Zip filename
  ftp,
  assets,
  cache: false,
  useDefault: true, // Use balm default task
  beforeTask: () => {},
  afterTask: () => {
    logger.log('gg');
  }
};

export default DEFAULTS;
