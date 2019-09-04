import env from './env';
import roots from './roots';
import paths from './paths';
import styles from './styles';
import assets from './assets';
import logs from './logs';

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
  assets,
  logs,
  useDefaults
};

global.BalmJS = {};
BalmJS.config = config;

export default config;
