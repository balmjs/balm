import './vendors';
import { Gulp, GulpPlugins } from './gulp';
import { BalmGlobal } from './balm';

type Path = import('path').PlatformPath;

declare global {
  namespace NodeJS {
    interface Global {
      path: Path;
      gulp: Gulp;
      $: GulpPlugins;
      server: any;
      webpack: any;
      through2: any;
      PluginError: any;
      BalmJS: BalmGlobal | {};
    }
  }

  const path: Path;
  const gulp: Gulp;
  const $: GulpPlugins;
  const server: any;
  const webpack: any;
  const through2: any;
  const PluginError: any;
  const BalmJS: BalmGlobal;
}
