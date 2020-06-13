import { Path } from './node';
import { Gulp, GulpPlugin, GulpPluginError } from './gulp';
import BalmGlobal from './balm';

declare global {
  namespace NodeJS {
    interface Global {
      path: Path;
      gulp: Gulp;
      $: GulpPlugin;
      server: any;
      webpack: any;
      through2: any;
      PluginError: GulpPluginError;
      BalmJS: BalmGlobal;
    }
  }

  var path: Path;
  var gulp: Gulp;
  var $: GulpPlugin;
  var server: any;
  var webpack: any;
  var through2: any;
  var PluginError: GulpPluginError;
  var BalmJS: BalmGlobal;
}
