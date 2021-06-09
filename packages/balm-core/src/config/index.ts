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

const config: Omit<BalmConfig, 'src' | 'dest' | 'inDesktopApp'> = {
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
