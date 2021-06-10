import './globals.js';
import env from './env.js';
import roots from './roots.js';
import paths from './paths.js';
import html from './html.js';
import styles from './styles.js';
import scripts from './scripts.js';
import images from './images.js';
import extras from './extras.js';
import assets from './assets.js';
import server from './server.js';
import ftp from './ftp.js';
import pwa from './pwa.js';
import logs from './logs.js';
import { BalmConfig, BalmVendor } from '@balm-core/index';

enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4
}

enum Bundler {
  webpack = 'webpack',
  rollup = 'rollup',
  esbuild = 'esbuild'
}

const vendors: BalmVendor[] = [];

const workspace = process.env.BALM_CWD as string;
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
BalmJS.LogLevel = LogLevel;
BalmJS.Bundler = Bundler;
BalmJS.vendors = vendors;
BalmJS.entries = [];

export default config;
