import Maker from './maker';
import {
  BalmEnv,
  ObjectEntry,
  TemplateOption,
  RenameOptions,
  HookOptions
} from '../config/types';

class BaseHooks {
  get env(): BalmEnv {
    return BalmJS.config.env;
  }

  // HTML
  html(input: string, output: string): void {
    Maker.generate('html', [input, output]);
  }

  // Stylesheets
  css(input: string, output: string): void {
    Maker.generate('postcss', [input, output]);
  }

  sass(input: string, output: string, options?: HookOptions): void {
    Maker.generate('sass', [input, output, options]);
  }

  less(input: string, output: string, options?: HookOptions): void {
    Maker.generate('less', [input, output, options]);
  }

  // JavaScript
  js(
    input: string | string[] | ObjectEntry,
    output: string,
    webpackOptions?: any
  ): void {
    Maker.generate('script', [input, output, webpackOptions]);
  }

  jsmin(input: string | string[], output: string, options?: HookOptions): void {
    Maker.generate('jsmin', [input, output, options]);
  }

  // Files & Directories
  copy(input: string | string[], output: string, options?: HookOptions): void {
    Maker.generate('copy', [input, output, options]);
  }

  remove(paths: string | string[]): void {
    Maker.generate('remove', [paths]);
  }

  // Cache
  version(
    input: string | string[],
    output: string,
    options?: HookOptions
  ): void {
    Maker.generate('version', [input, output, options]);
  }

  // Server
  serve(handler: Function): void {
    Maker.generate('serve', [handler]);
  }
}

class Hooks extends BaseHooks {
  // Stylesheets
  sprite(): void {
    Maker.generate('sprite');
  }

  url(input: string | string[], output: string): void {
    Maker.generate('url', [input, output]);
  }

  // PWA
  generateSW(pwaOptions: object): void {
    Maker.generate('pwa', ['generateSW', pwaOptions]);
  }

  injectManifest(pwaOptions: object): void {
    Maker.generate('pwa', ['injectManifest', pwaOptions]);
  }

  // Assets
  zip(
    input: string | string[] = '',
    output = '',
    filename = 'archive.zip'
  ): void {
    Maker.generate('zip', [input, output, filename]);
  }

  ftp(localFiles: string, options?: HookOptions): void {
    Maker.generate('ftp', [localFiles, options]);
  }

  publish(
    input: string | TemplateOption[],
    output: string,
    renameOptions?: string | Function | RenameOptions
  ): void {
    Maker.generate('publish', [input, output, renameOptions]);
  }

  // Others
  modernizr(): void {
    Maker.generate('modernizr');
  }
}

export default Hooks;
