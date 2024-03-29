import { PUBLIC_URL } from '../../config/constants.js';

class HtmlTask extends BalmJS.BalmTask {
  constructor() {
    super('html');

    this.defaultInput = [
      node.path.join(BalmJS.file.templateBasePath, '*.html'),
      node.path.join(BalmJS.file.templateBasePath, BalmJS.config.pwa.manifest)
    ];
    this.defaultOutput = BalmJS.config.dest.base;
  }

  #updateAssetsPath = (type: string): any => {
    const isManifest: boolean = type === 'manifest';
    const assetsType: string = isManifest ? 'img' : type;
    const from: string = (BalmJS.config.paths.source as any)[assetsType];
    const to: string = BalmJS.file.assetsPath(
      (BalmJS.config.paths.target as any)[assetsType]
    );

    const assetsPathSrc = new RegExp(
      isManifest ? `/?${from}` : `${PUBLIC_URL}/${from}`,
      'g'
    );
    const assetsPathDest = `${PUBLIC_URL}/${to}`;

    BalmJS.logger.debug(
      `${this.name} task - assets path`,
      {
        regex: assetsPathSrc,
        replacement: assetsPathDest
      },
      {
        pre: true
      }
    );

    return BalmJS.plugins.replace(assetsPathSrc, assetsPathDest);
  };

  #hasSourcePath = (type: string): boolean => {
    return !!(BalmJS.config.paths.source as any)[type];
  };

  recipe(input?: string, output?: string): Function {
    const balmHtml = (): any => {
      this.init(input, output);

      let stream: any = this.src;

      if (BalmJS.config.env.isProd) {
        stream = stream
          .pipe(
            $.useref({
              base: BalmJS.config.workspace,
              searchPath: [
                BalmJS.config.roots.tmp,
                BalmJS.config.roots.source,
                '.'
              ]
            })
          )
          .pipe(
            $.if(/\.html$/, BalmJS.plugins.htmlmin(BalmJS.config.html.options))
          );

        ['css', 'js', 'img', 'media', 'manifest'].forEach((type: string) => {
          const canUpdate: boolean =
            type === 'manifest'
              ? BalmJS.config.pwa.enabled
              : this.#hasSourcePath(type);

          if (canUpdate) {
            stream = stream.pipe(this.#updateAssetsPath(type));
          }
        });

        stream = BalmJS.config.assets.cache
          ? stream.pipe(
              $.if(BalmJS.config.pwa.manifest, BalmJS.file.setPublicPath())
            )
          : stream.pipe(BalmJS.file.setPublicPath());
      } else {
        ['css', 'js', 'img', 'media'].forEach((type: string, index: number) => {
          const canUpdate: boolean =
            index > 1
              ? this.#hasSourcePath(type) && !BalmJS.config.inFrontend
              : this.#hasSourcePath(type);

          if (canUpdate) {
            stream = stream.pipe(this.#updateAssetsPath(type));
          }
        });

        stream = stream.pipe(BalmJS.file.setPublicPath());
      }

      return stream.pipe(gulp.dest(this.output));
    };

    return balmHtml;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default HtmlTask;
