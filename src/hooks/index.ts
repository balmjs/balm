import Maker from './maker';
import { BalmEnv, ObjectEntry, TemplateOption } from '../config/types';

interface RenameOptions {
  dirname?: string;
  prefix?: string;
  basename?: string;
  suffix?: string;
  extname?: string;
}

class BaseHooks {
  get env(): BalmEnv {
    return BalmJS.config.env;
  }

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

  // JavaScript
  js(
    input: string | string[] | ObjectEntry,
    output: string,
    options?: any
  ): void {
    Maker.generate('script', [input, output, options]);
  }

  // Files & Directories
  copy(
    input: string | string[],
    output: string,
    renameOptions?: string | Function | RenameOptions
  ): void {
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
  serve(handler: Function): void {
    Maker.generate('serve', [handler]);
  }
}

class Hooks extends BaseHooks {
  // HTML
  html(): void {
    Maker.generate('html');
  }

  // Stylesheets
  sprite(): void {
    Maker.generate('sprite');
  }

  url(input: string | string[], output: string): void {
    Maker.generate('url', [input, output]);
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
