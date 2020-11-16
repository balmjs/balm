import Maker from './maker';
import {
  BalmEnvObject,
  BalmEntry,
  Configuration,
  InputOptions,
  OutputOptions,
  BuildOptions,
  TransformOptions,
  RenameOptions,
  HookOptions,
  SpriteOptions,
  ReplaceOptions,
  TemplateOption
} from '@balm-core/index';

class BaseHooks {
  get env(): BalmEnvObject {
    return BalmJS.config.env;
  }

  // HTML
  html(input: string, output: string): void {
    Maker.generate('html', [input, output]);
  }

  // Stylesheets
  css(input: string | string[], output: string): void {
    Maker.generate('postcss', [input, output]);
  }

  sass(input: string | string[], output: string, options?: HookOptions): void {
    Maker.generate('sass', [input, output, options]);
  }

  less(input: string | string[], output: string, options?: HookOptions): void {
    Maker.generate('less', [input, output, options]);
  }

  url(input: string | string[], output: string): void {
    Maker.generate('url', [input, output]);
  }

  // JavaScript
  js() {
    BalmJS.logger.warn(
      'balm api',
      '`mix.js` is deprecated, please use `mix.webpack`/`mix.rollup`/`mix.esbuild` instead.'
    );
  }

  webpack(input: BalmEntry, output: string, options?: Configuration) {
    Maker.generate('webpack', [input, output, options]);
  }

  esbuild(
    input: string | string[],
    output: string,
    options?: BuildOptions | TransformOptions
  ) {
    Maker.generate('esbuild', [input, output, options]);
  }

  rollup(input: InputOptions, output: OutputOptions | OutputOptions[]) {
    Maker.generate('rollup', [input, output]);
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
    assetsOptions?: object
  ): void {
    Maker.generate('version', [input, output, assetsOptions]);
  }

  // Server
  serve(handler: Function): void {
    Maker.generate('serve', [handler]);
  }
}

class BalmHooks extends BaseHooks {
  // Stylesheets
  sprite(input: string[], output: string, spriteOptions?: SpriteOptions): void {
    Maker.generate('sprite', [input, output, spriteOptions]);
  }

  // Assets
  replace(
    input: string | string[],
    output: string,
    options: ReplaceOptions | ReplaceOptions[]
  ): void {
    Maker.generate('replace', [input, output, options]);
  }

  publish(
    input: string | TemplateOption[],
    output: string,
    renameOptions?: string | Function | RenameOptions
  ): void {
    Maker.generate('publish', [input, output, renameOptions]);
  }

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

  // PWA
  generateSW(pwaOptions: object): void {
    Maker.generate('pwa', ['generateSW', pwaOptions]);
  }

  injectManifest(pwaOptions: object): void {
    Maker.generate('pwa', ['injectManifest', pwaOptions]);
  }

  // Others
  modernizr(): void {
    Maker.generate('modernizr');
  }
}

export default BalmHooks;
