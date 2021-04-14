import { Path } from './node';
import { Gulp, GulpPlugin } from './gulp';
import BalmGlobal from './balm';

type PluginError = import('plugin-error').Constructor;

declare global {
  namespace NodeJS {
    interface Global {
      path: Path;
      gulp: Gulp;
      $: GulpPlugin;
      server: any;
      through2: any;
      PluginError: PluginError;
      NOOP: Function;
      BalmJS: BalmGlobal;
    }
  }

  var path: Path;
  var gulp: Gulp;
  var $: GulpPlugin;
  var server: any;
  var through2: any;
  var PluginError: PluginError;
  var NOOP: Function;
  var BalmJS: BalmGlobal;
}
