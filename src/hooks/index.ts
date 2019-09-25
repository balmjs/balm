import Maker from './maker';
import { ObjectEntry, TemplateOption } from '../config/types';

class BaseHooks {
  // Stylesheets
  sass(input: string, output: string, options?: object): void {
    Maker.generate('sass', [input, output, options]);
  }

  less(input: string, output: string, options?: object): void {
    Maker.generate('less', [input, output, options]);
  }

  css(input: string, output: string): void {
    Maker.generate('postcss', [input, output]);
  }

  // styles(input: string[], output: string): void {}

  // JavaScript
  js(
    input: string | string[] | ObjectEntry,
    output: string,
    options?: any
  ): void {
    Maker.generate('script', [input, output, options]);
  }

  // scripts(input: string[], output: string): void {}

  // Files & Directories
  copy(input: string | string[], output: string, renameOptions?: object): void {
    Maker.generate('copy', [input, output, renameOptions]);
  }

  remove(input: string | string[]): void {
    Maker.generate('remove', [input]);
  }

  // Cache
  version(input: string | string[], output: string, options?: object): void {
    Maker.generate('version', [input, output, options]);
  }

  // Server
  serve(): void {
    Maker.generate('serve');
  }
}

class Hooks extends BaseHooks {
  // HTML
  html(): void {
    Maker.generate('html');
  }

  // Stylesheets
  url(): void {
    Maker.generate('url');
  }

  // Server
  watch(handler: Function): void {
    Maker.generate('watch', [handler]);
  }

  // PWA
  generateSW(options: object = {}): void {
    Maker.generate('pwa', ['generateSW', options]);
  }

  injectManifest(options: object = {}): void {
    Maker.generate('pwa', ['injectManifest', options]);
  }

  // Assets
  zip(
    input: string | string[] = '',
    output = '',
    filename = 'archive.zip'
  ): void {
    Maker.generate('zip', [input, output, filename]);
  }

  ftp(localFiles: string, options = {}): void {
    Maker.generate('ftp', [localFiles, options]);
  }

  publish(
    input: string | TemplateOption[],
    output: string,
    renameOptions?: object
  ): void {
    Maker.generate('publish', [input, output, renameOptions]);
  }

  // Others
  modernizr(): void {
    Maker.generate('modernizr');
  }
}

export default Hooks;
