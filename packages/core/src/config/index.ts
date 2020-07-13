import './globals';
import env from './env';
import roots from './roots';
import paths from './paths';
import html from './html';
import styles from './styles';
import scripts from './scripts';
import images from './images';
import extras from './extras';
import assets from './assets';
import server from './server';
import ftp from './ftp';
import pwa from './pwa';
import logs from './logs';
import { BalmConfig, BalmVendor } from '@balm-types/index';

enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4
}

const noop: Function = () => {};
const vendors: BalmVendor[] = [];

const workspace: string = process.cwd();
/**
 * Project type
 *
 * set `true` for a static HTML project
 * set `false` for a dynamic language project (e.g. PHP framework)
 */
const inFrontend = true;
const useDefaults = true; // Use balm default task

const config: Omit<BalmConfig, 'src' | 'dest'> = {
  env,
  workspace,
  inFrontend,
  useDefaults,
  roots,
  paths,
  html,
  styles,
  scripts,
  images,
  extras,
  assets,
  server,
  ftp,
  pwa,
  logs
};

BalmJS.config = config as BalmConfig;
BalmJS.noop = noop;
BalmJS.LogLevel = LogLevel;
BalmJS.vendors = vendors;

export default config;
