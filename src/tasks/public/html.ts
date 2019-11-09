import { MANIFEST } from '../../config/constants';

class HtmlTask extends BalmJS.BalmTask {
  constructor() {
    super('html');

    this.defaultInput = [
      path.join(BalmJS.config.src.base, '*.html'),
      path.join(BalmJS.config.src.base, MANIFEST)
    ];
    this.defaultOutput = BalmJS.config.dest.base;
  }

  private _updateAssetsPath(type: any): any {
    const isManifest: boolean = type === 'manifest';
    const assetsType: string = isManifest ? 'img' : type;
    const from: string = (BalmJS.config.paths.source as any)[assetsType]
      .split('/')
      .pop();
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
          )
          .pipe(this._updateAssetsPath('css'))
          .pipe(this._updateAssetsPath('js'))
          .pipe(this._updateAssetsPath('img'))
          .pipe(this._updateAssetsPath('media'))
          .pipe($.if(MANIFEST, this._updateAssetsPath('manifest')));

        stream = BalmJS.config.assets.cache
          ? stream.pipe($.if(MANIFEST, BalmJS.file.setPublicPath()))
          : stream.pipe(BalmJS.file.setPublicPath());
      } else {
        stream = stream
          .pipe(this._updateAssetsPath('css'))
          .pipe(this._updateAssetsPath('js'))
          .pipe($.if(!BalmJS.config.inFrontend, this._updateAssetsPath('img')))
          .pipe(
            $.if(!BalmJS.config.inFrontend, this._updateAssetsPath('media'))
          )
          .pipe(BalmJS.file.setPublicPath());
      }

      return stream.pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default HtmlTask;
