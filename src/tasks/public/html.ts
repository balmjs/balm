class HtmlTask extends BalmJS.BalmTask {
  constructor() {
    super('html');

    this.defaultInput = [
      path.join(BalmJS.config.src.base, '*.html'),
      path.join(BalmJS.config.src.base, BalmJS.config.pwa.manifest)
    ];
    this.defaultOutput = BalmJS.config.dest.base;
  }

  private _updateAssetsPath(type: any): any {
    const isManifest: boolean = type === 'manifest';
    const assetsType: string = isManifest ? 'img' : type;
    const from: string = (BalmJS.config.paths.source as any)[assetsType];
    const to: string = BalmJS.file.assetsPath(
      (BalmJS.config.paths.target as any)[assetsType]
    );

    const assetsPathSrc = new RegExp(
      isManifest
        ? `/?${from}`
        : `${BalmJS.config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    const assetsPathDest = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

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

    return $.replace(assetsPathSrc, assetsPathDest);
  }

  private _hasSourcePath(type: string): boolean {
    return !!(BalmJS.config.paths.source as any)[type];
  }

  recipe(input?: string, output?: string): any {
    return (): any => {
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
              : this._hasSourcePath(type);

          if (canUpdate) {
            stream = stream.pipe(this._updateAssetsPath(type));
          }
        });

        stream = BalmJS.config.assets.cache
          ? stream.pipe(
              $.if(BalmJS.config.pwa.enabled, BalmJS.file.setPublicPath())
            )
          : stream.pipe(BalmJS.file.setPublicPath());
      } else {
        ['css', 'js', 'img', 'media'].forEach((type: string, index: number) => {
          const canUpdate: boolean =
            index > 1
              ? this._hasSourcePath(type) && !BalmJS.config.inFrontend
              : this._hasSourcePath(type);

          if (canUpdate) {
            stream = stream.pipe(this._updateAssetsPath(type));
          }
        });

        stream = stream.pipe(BalmJS.file.setPublicPath());
      }

      return stream.pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default HtmlTask;
